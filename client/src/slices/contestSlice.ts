import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contest } from '../api/contests'
import { AppDispatch, RootState } from '../app/store'
import * as ws from '../app/websocket'
import { Game } from '../api/games'
import * as contestant from './contestantSlice'
import * as strife from './strifeSlice'

export interface ContestArgs {
    gameId: string
    contestId: string
}

export const createContestAsync = createAsyncThunk(
    'contest/createContest',
    async (gameId: string) => {
        return await api.contests.create(gameId)
    }
)

export const removeContestAsync = createAsyncThunk(
    'contest/removeContest',
    async ({ gameId, contestId }: ContestArgs, { dispatch }) => {
        await dispatch(remove())
        return await api.contests.remove(gameId, contestId)
    }
)

export const rollTargetNumberAsync = createAsyncThunk(
    'contest/rollTargetNumber',
    async ({ gameId, contestId }: ContestArgs) => {
        return await api.contests.update(gameId, {
            id: contestId,
            status: 'targetSet'
        })
    }
)

export const rollContestResultAsync = createAsyncThunk(
    'contest/rollContestResult',
    async ({ gameId, contestId }: ContestArgs) => {
        return await api.contests.update(gameId, {
            id: contestId,
            status: 'complete'
        })
    }
)

export const subscribeAsync = createAsyncThunk(
    'contest/subscribe',
    async (_, { dispatch }) => {
        ws.subscribe(dispatch as AppDispatch, 'contest', [
            { name: 'add', handler: addAsync },
            { name: 'update', handler: updateAsync },
            { name: 'remove', handler: removeAsync }
        ])
    }
)

export const setGameAsync = createAsyncThunk(
    'contest/setGame',
    async ({ contests }: Game, { dispatch }) => {
        const sorted = Object.values(contests).sort((a, b) => b.sort - a.sort)
        if (sorted.length === 0) {
            dispatch(removeAsync())
            return
        }
        dispatch(updateAsync({ value: sorted[0] }))
    }
)

export const addAsync = createAsyncThunk(
    'contest/addAsync',
    async ({ value }: ws.EventArgs<Contest>, { dispatch }) => {
        dispatch(add(value))
        dispatch(contestant.setContestAsync(value))
        dispatch(strife.setContestAsync(value))
    }
)

export const updateAsync = createAsyncThunk(
    'contest/updateAsync',
    async ({ value }: ws.EventArgs<Contest>, { dispatch }) => {
        dispatch(update(value))
        dispatch(contestant.setContestAsync(value))
        dispatch(strife.setContestAsync(value))
    }
)

export const removeAsync = createAsyncThunk(
    'contest/removeAsync',
    async (_, { dispatch }) => {
        dispatch(remove())
        dispatch(contestant.setContestAsync(undefined))
        dispatch(strife.setContestAsync(undefined))
    }
)

export interface ContestState {
    status: 'loading' | 'idle'
    current: Contest | undefined
}

const initialState: ContestState = {
    status: 'idle',
    current: undefined
}

export const contestSlice = createSlice({
    name: 'contest',
    initialState,
    reducers: {
        add: (state, { payload }) => {
            state.current = payload
        },
        update: (state, { payload }) => {
            state.current = payload
        },
        remove: (state) => {
            state.current = undefined
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createContestAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(rollTargetNumberAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createContestAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(rollTargetNumberAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
    }
})

export const { add, remove, update } = contestSlice.actions

export const selectContestStatus = (state: RootState) => state.contest.current?.status ?? 'complete'
export const selectContestStoreStatus = (state: RootState) => state.contest.status
export const selectCurrentContest = (state: RootState) => state.contest.current
export const selectContestId = (state: RootState) => state.contest.current?.id

export default contestSlice.reducer

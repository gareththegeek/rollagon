import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contest, HarmTagType } from '../api/contests'
import { Strife } from '../api/strife'
import { RootState } from '../app/store'
import * as ws from '../app/websocket'

export const createContestAsync = createAsyncThunk(
    'contest/createContest',
    async (gameId: string) => {
        return await api.contests.create(gameId)
    }
)

export interface CloseContestProps {
    gameId: string
    contestId: string
}

export const removeContestAsync = createAsyncThunk(
    'contest/removeContest',
    async ({ gameId, contestId }: CloseContestProps, { dispatch }) => {
        await dispatch(remove())
        return await api.contests.remove(gameId, contestId)
    }
)

export interface RollTargetNumberArgs {
    gameId: string
    contestId: string
}

export const rollTargetNumberAsync = createAsyncThunk(
    'contest/rollTargetNumber',
    async ({ gameId, contestId }: RollTargetNumberArgs) => {
        return await api.contests.update(gameId, {
            id: contestId,
            status: 'targetSet'
        })
    }
)

export const subscribeAsync = createAsyncThunk(
    'contest/subscribe',
    async (_, { dispatch }) => {
        ws.subscribe(dispatch, 'contest', ['add', 'update', 'remove'])
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
        add: (state, { payload: { value } }) => {
            state.current = value
        },
        update: (state, { payload: { value } }) => {
            state.current = value
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

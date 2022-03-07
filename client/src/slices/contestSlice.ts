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
        dispatch(remove())
        return await api.contests.remove(gameId, contestId)
    }
)

export interface StrifeDiceChangeArgs {
    gameId: string
    contestId: string
    strife: Strife
    type: string
    quantity: number
}

export const strifeDiceChangeAsync = createAsyncThunk(
    'contest/strifeDiceChange',
    async ({ gameId, contestId, strife, type, quantity }: StrifeDiceChangeArgs, { dispatch }) => {
        const next: Strife = {
            ...strife,
            dicePool: {
                ...strife.dicePool,
                dice: [
                    ...strife.dicePool.dice.filter(x => x.type !== type),
                    ...(new Array(quantity).fill({
                        type
                    }))
                ]
            }
        }
        dispatch(updateStrife({ value: next }))
        return await api.strife.update(gameId, contestId, next)
    }
)

export interface StrifeLevelChangeArgs {
    gameId: string
    contestId: string
    strife: Strife
    strifeLevel: number
}

export const strifeLevelChangeAsync = createAsyncThunk(
    'contest/strifeLevelChange',
    async ({ gameId, contestId, strife, strifeLevel }: StrifeLevelChangeArgs, { dispatch }) => {
        const next: Strife = {
            ...strife,
            strifeLevel
        }
        dispatch(updateStrife({ value: next }))
        return await api.strife.update(gameId, contestId, next)
    }
)

export interface HarmTagsChangeArgs {
    gameId: string
    contestId: string
    strife: Strife
    harmTags: HarmTagType[]
}

export const harmTagsChangeAsync = createAsyncThunk(
    'contest/harmTagsChange',
    async ({ gameId, contestId, strife, harmTags }: HarmTagsChangeArgs, { dispatch }) => {
        const next: Strife = {
            ...strife,
            harmTags
        }
        dispatch(updateStrife({ value: next }))
        return await api.strife.update(gameId, contestId, next)
    }
)

export interface RollTargetNumberArgs {
    gameId: string
    contestId: string
}

export const rollTargetNumber = createAsyncThunk(
    'contest/rollTargetNumber',
    async ({ gameId, contestId }: RollTargetNumberArgs, { dispatch }) => {
        dispatch(update({ value: { status: 'targetSet' } }))
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
        ws.subscribe(dispatch, 'strife', ['updateStife'])
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
        },
        updateStrife: (state, { payload: { value } }) => {
            if (state.current === undefined) {
                return
            }
            state.current.strife = value
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(strifeDiceChangeAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(harmTagsChangeAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(strifeLevelChangeAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(strifeDiceChangeAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(harmTagsChangeAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(strifeLevelChangeAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
    }
})

export const { add, remove, update, updateStrife } = contestSlice.actions

export const selectContestStatus = (state: RootState) => state.contest.current?.status ?? 'complete'
export const selectContestStoreStatus = (state: RootState) => state.contest.status
export const selectCurrentContest = (state: RootState) => state.contest.current
export const selectContestId = (state: RootState) => state.contest.current?.id
export const selectCurrentStrife = (state: RootState) => state.contest.current?.strife

export default contestSlice.reducer

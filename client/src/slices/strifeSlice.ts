import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { HarmTagType } from '../api/contests'
import { Strife } from '../api/strife'
import { RootState } from '../app/store'
import * as ws from '../app/websocket'

export interface StrifeDiceChangeArgs {
    gameId: string
    contestId: string
    strife: Strife
    type: string
    quantity: number
}

export const strifeDiceChangeAsync = createAsyncThunk(
    'strife/strifeDiceChange',
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
        await dispatch(update({ value: next }))
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
    'strife/strifeLevelChange',
    async ({ gameId, contestId, strife, strifeLevel }: StrifeLevelChangeArgs, { dispatch }) => {
        const next: Strife = {
            ...strife,
            strifeLevel
        }
        await dispatch(update({ value: next }))
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
    'strife/harmTagsChange',
    async ({ gameId, contestId, strife, harmTags }: HarmTagsChangeArgs, { dispatch }) => {
        const next: Strife = {
            ...strife,
            harmTags
        }
        await dispatch(update({ value: next }))
        return await api.strife.update(gameId, contestId, next)
    }
)

export const subscribeAsync = createAsyncThunk(
    'strife/subscribe',
    async (_, { dispatch }) => {
        ws.subscribe(dispatch, 'strife', ['update'])
    }
)

export interface StrifeState {
    status: 'loading' | 'idle'
    strife: Strife | undefined
}

const initialState: StrifeState = {
    status: 'idle',
    strife: undefined
}

export const strifeSlice = createSlice({
    name: 'strife',
    initialState,
    reducers: {
        update: (state, { payload: { value } }) => {
            state.strife = value
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

export const { update } = strifeSlice.actions

export const selectCurrentStrife = (state: RootState) => state.contest.current?.strife

export default strifeSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contest } from '../api/contests'
import { HarmTagType, Strife } from '../api/strife'
import { AppDispatch, RootState } from '../app/store'
import * as ws from '../app/websocket'
import { ContestArgs } from './contestSlice'

export interface StrifeDiceChangeArgs extends ContestArgs {
    strife: Strife
    type: string
    quantity: number
}

export const strifeDiceChangeAsync = createAsyncThunk(
    'strife/strifeDiceChange',
    async ({ gameId, contestId, strife, type, quantity }: StrifeDiceChangeArgs, { dispatch, rejectWithValue }) => {
        try {
            const next: Strife = {
                ...strife,
                timestamp: new Date().toISOString(),
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
            await dispatch(update(next))
            return await api.strife.update(gameId, contestId, next)
        } catch (e: any) {
            dispatch(update(strife))
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export interface StrifeLevelChangeArgs extends ContestArgs {
    strife: Strife
    strifeLevel: number
}

export const strifeLevelChangeAsync = createAsyncThunk(
    'strife/strifeLevelChange',
    async ({ gameId, contestId, strife, strifeLevel }: StrifeLevelChangeArgs, { dispatch, rejectWithValue }) => {
        try {
            const next: Strife = {
                ...strife,
                timestamp: new Date().toISOString(),
                strifeLevel
            }
            await dispatch(update(next))
            return await api.strife.update(gameId, contestId, next)
        } catch (e: any) {
            dispatch(update(strife))
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export interface HarmTagsChangeArgs extends ContestArgs {
    strife: Strife
    harmTags: HarmTagType[]
}

export const harmTagsChangeAsync = createAsyncThunk(
    'strife/harmTagsChange',
    async ({ gameId, contestId, strife, harmTags }: HarmTagsChangeArgs, { dispatch, rejectWithValue }) => {
        try {
            const next: Strife = {
                ...strife,
                timestamp: new Date().toISOString(),
                harmTags
            }
            await dispatch(update(next))
            return await api.strife.update(gameId, contestId, next)
        } catch (e: any) {
            dispatch(update(strife))
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const subscribeAsync = createAsyncThunk(
    'strife/subscribe',
    async (_, { dispatch }) => {
        ws.subscribe(dispatch as AppDispatch, 'strife', [
            { name: 'update', handler: updateAsync }
        ])
    }
)

export const setContestAsync = createAsyncThunk(
    'strife/setContest',
    async (contest: Contest | undefined, { dispatch }) => {
        dispatch(update(contest?.strife))
    }
)

export const updateAsync = createAsyncThunk(
    'strife/updateAsync',
    async ({ value }: ws.EventArgs<Strife>, { dispatch, getState }) => {
        const existing = selectCurrentStrife(getState() as RootState)
        if (existing !== undefined && existing.timestamp < value.timestamp) {
            dispatch(update(value))
        }
    }
)

export interface StrifeState {
    strife: Strife | undefined
}

const initialState: StrifeState = {
    strife: undefined
}

export const strifeSlice = createSlice({
    name: 'strife',
    initialState,
    reducers: {
        update: (state, { payload }) => {
            state.strife = payload
        }
    }
})

export const { update } = strifeSlice.actions
export const thunks = [
    strifeDiceChangeAsync,
    strifeLevelChangeAsync,
    harmTagsChangeAsync
]

export const selectCurrentStrife = (state: RootState) => state.strife.strife

export default strifeSlice.reducer

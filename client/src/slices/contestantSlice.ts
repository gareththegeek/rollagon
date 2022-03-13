import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contestant } from '../api/contestants'
import { Contest } from '../api/contests'
import { AppDispatch, RootState } from '../app/store'
import * as ws from '../app/websocket'
import { ContestArgs } from './contestSlice'

export interface ContestantArgs extends ContestArgs {
    playerId: string
}

export const joinContestAsync = createAsyncThunk(
    'contestant/joinContest',
    async ({ gameId, contestId, playerId }: ContestantArgs, { rejectWithValue }) => {
        try {
            return await api.contestants.create(gameId, contestId, playerId)
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const leaveContestAsync = createAsyncThunk(
    'contestant/leaveContest',
    async ({ gameId, contestId, playerId }: ContestantArgs, { rejectWithValue }) => {
        try {
            return await api.contestants.remove(gameId, contestId, playerId)
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export interface SetReadyArgs extends ContestArgs {
    contestant: Contestant,
    ready: boolean
}

export const setReadyAsync = createAsyncThunk(
    'contestant/setReady',
    async ({ gameId, contestId, contestant, ready }: SetReadyArgs, { dispatch, rejectWithValue }) => {
        try {
            const next = {
                ...contestant,
                timestamp: new Date().toISOString(),
                ready
            }
            await dispatch(update(next))
            return await api.contestants.update(gameId, contestId, next)
        } catch (e: any) {
            await dispatch(update(contestant))
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export interface DiceChangeArgs extends ContestArgs {
    contestant: Contestant,
    type: string,
    quantity: number
}

export const diceChangeAsync = createAsyncThunk(
    'contestant/diceChange',
    async ({ gameId, contestId, contestant, type, quantity }: DiceChangeArgs, { dispatch, rejectWithValue }) => {
        try {
            const next: Contestant = {
                ...contestant,
                timestamp: new Date().toISOString(),
                dicePool: {
                    ...contestant.dicePool,
                    dice: [
                        ...contestant.dicePool.dice.filter(x => x.type !== type),
                        ...(new Array(quantity).fill({
                            type
                        }))
                    ]
                }
            }
            await dispatch(update(next))
            return await api.contestants.update(gameId, contestId, next)
        } catch (e: any) {
            await dispatch(update(contestant))
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const subscribeAsync = createAsyncThunk(
    'contestant/subscribe',
    async (_, { dispatch }) => {
        ws.subscribe(dispatch as AppDispatch, 'contestant', [
            { name: 'add', handler: addAsync },
            { name: 'update', handler: updateAsync },
            { name: 'remove', handler: removeAsync }
        ])
    }
)

export const setContestAsync = createAsyncThunk(
    'contestant/setContest',
    async (contest: Contest | undefined, { dispatch }) => {
        if (contest === undefined) {
            dispatch(clear())
            return
        }
        dispatch(set(contest.contestants))
    }
)

export const addAsync = createAsyncThunk(
    'contestant/addAsync',
    async ({ value }: ws.EventArgs<Contestant>, { dispatch }) => {
        dispatch(add(value))
    }
)

export const updateAsync = createAsyncThunk(
    'contestant/updateAsync',
    async ({ value }: ws.EventArgs<Contestant>, { dispatch, getState }) => {
        const existing = selectContestant(value.playerId)(getState() as RootState)
        if (existing !== undefined && existing.timestamp < value.timestamp) {
            dispatch(update(value))
        }
    }
)

export const removeAsync = createAsyncThunk(
    'contestant/removeAsync',
    async ({ value }: ws.EventArgs<Contestant>, { dispatch }) => {
        dispatch(remove(value))
    }
)

export interface ContestantState {
    contestants: Record<string, Contestant>
}

const initialState: ContestantState = {
    contestants: {}
}

export const contestantSlice = createSlice({
    name: 'contestant',
    initialState,
    reducers: {
        set: (state, { payload }) => {
            state.contestants = payload
        },
        add: (state, { payload }) => {
            state.contestants[payload.playerId] = payload
        },
        update: (state, { payload }) => {
            state.contestants[payload.playerId] = payload
        },
        remove: (state, { payload }) => {
            delete state.contestants[payload.playerId]
        },
        clear: (state) => {
            state.contestants = {}
        }
    }
})

export const { set, add, remove, update, clear } = contestantSlice.actions
export const thunks = [
    joinContestAsync,
    leaveContestAsync,
    setReadyAsync,
    diceChangeAsync
]

export const selectReadyContestantCount = (state: RootState) => {
    const contestants = Object.values(state.contestant.contestants)
    const result = {
        ready: contestants.filter(x => x.ready).length ?? 0,
        total: contestants.length
    }
    return {
        ...result,
        all: result.ready === result.total && result.total > 0
    }
}
export const selectContestants = (state: RootState) => Object.values(state.contestant.contestants)
export const selectContestant = (playerId: string | undefined) => (state: RootState) =>
    playerId !== undefined
        ? state.contestant.contestants[playerId]
        : undefined

export default contestantSlice.reducer

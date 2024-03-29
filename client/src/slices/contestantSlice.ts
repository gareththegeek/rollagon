import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contestant, DiceType } from '../api/contestants'
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

export interface SetNameDieArgs extends ContestArgs {
    contestant: Contestant,
    value: number
}

export const setNameDieAsync = createAsyncThunk(
    'contestant/setNameDie',
    async ({ gameId, contestId, contestant, value }: SetNameDieArgs, { dispatch, rejectWithValue }) => {
        try {
            const next = {
                type: `d${value}` as DiceType
            }
            dispatch(rolling(true))
            return await api.nameDie.update(gameId, contestId, contestant.playerId, next)
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
        ws.subscribe(dispatch as AppDispatch, 'nameDie', [
            { name: 'update', handler: nameDieAsync }
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

export const nameDieAsync = createAsyncThunk(
    'contestant/nameDieAsync',
    async ({ value }: ws.EventArgs<Contestant>, { dispatch, getState }) => {
        const existing = selectContestant(value.playerId)(getState() as RootState)
        dispatch(rolling(false))
        if (existing !== undefined) {
            dispatch(update(value))
        }
    }
)

export const removeAsync = createAsyncThunk(
    'contestant/removeAsync',
    async ({ params }: ws.EventArgs<Contestant>, { dispatch }) => {
        dispatch(remove(params))
    }
)

export interface ContestantState {
    contestants: Record<string, Contestant>
    rollingNameDie: boolean
}

const initialState: ContestantState = {
    contestants: {},
    rollingNameDie: false
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
        },
        rolling: (state, { payload }) => {
            state.rollingNameDie = payload
        }
    }
})

export const { set, add, remove, update, clear, rolling } = contestantSlice.actions
export const thunks = [
    joinContestAsync,
    leaveContestAsync,
    setReadyAsync,
    diceChangeAsync,
    setNameDieAsync
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

const orderContestantsByResult = (a: Contestant, b: Contestant): number => {
    if (!a.dicePool.rolled || !b.dicePool.rolled) {
        return 0
    }
    return a.dicePool.score! - b.dicePool.score!;
}

export const selectContestants = (state: RootState) => Object.values(state.contestant.contestants).sort(orderContestantsByResult)
export const selectContestant = (playerId: string | undefined) => (state: RootState) =>
    playerId !== undefined
        ? state.contestant.contestants[playerId]
        : undefined
export const selectRollingNameDie = (state: RootState) => state.contestant.rollingNameDie

export default contestantSlice.reducer

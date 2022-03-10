import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contest, Contestant } from '../api/contests'
import { AppDispatch, RootState } from '../app/store'
import * as ws from '../app/websocket'

export interface JoinContestArgs {
    gameId: string
    contestId: string
    playerId: string
}

export const joinContestAsync = createAsyncThunk(
    'contestant/joinContest',
    async ({ gameId, contestId, playerId }: JoinContestArgs) => {
        return await api.contestants.create(gameId, contestId, playerId)
    }
)

export interface SetReadyArgs {
    gameId: string
    contestId: string
    contestant: Contestant,
    ready: boolean
}

export const setReadyAsync = createAsyncThunk(
    'contestant/setReady',
    async ({ gameId, contestId, contestant, ready }: SetReadyArgs, { dispatch }) => {
        const next = {
            ...contestant,
            ready
        }
        await dispatch(update({ value: next }))
        return await api.contestants.update(gameId, contestId, next)
    }
)

export interface DiceChangeArgs {
    gameId: string
    contestId: string
    contestant: Contestant,
    type: string,
    quantity: number
}

export const diceChangeAsync = createAsyncThunk(
    'contestant/diceChange',
    async ({ gameId, contestId, contestant, type, quantity }: DiceChangeArgs, { dispatch }) => {
        const next: Contestant = {
            ...contestant,
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
        await dispatch(update({ value: next }))
        return await api.contestants.update(gameId, contestId, next)
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
    async ({ value }: ws.EventArgs<Contestant>, { dispatch }) => {
        dispatch(update(value))
    }
)

export const removeAsync = createAsyncThunk(
    'contestant/removeAsync',
    async ({ value }: ws.EventArgs<Contestant>, { dispatch }) => {
        dispatch(remove(value))
    }
)

export interface ContestantState {
    status: 'loading' | 'idle'
    contestants: Record<string, Contestant>
}

const initialState: ContestantState = {
    status: 'idle',
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(joinContestAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(joinContestAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
    }
})

export const { set, add, remove, update, clear } = contestantSlice.actions

export const selectContestant = (playerId: string | undefined) => (state: RootState) =>
    playerId !== undefined
        ? state.contestant.contestants[playerId]
        : undefined

export default contestantSlice.reducer

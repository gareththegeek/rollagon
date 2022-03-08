import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contestant } from '../api/contests'
import { RootState } from '../app/store'
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

export const subscribeAsync = createAsyncThunk(
    'contestant/subscribe',
    async (_, { dispatch }) => {
        ws.subscribe(dispatch, 'contestant', ['add', 'update', 'remove'])
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
        add: (state, { payload: { value } }) => {
            state.contestants[value.id] = value
        },
        update: (state, { payload: { value } }) => {
            state.contestants[value.id] = value
        },
        remove: (state, { payload: { value } }) => {
            delete state.contestants[value.id]
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

export const { add, remove, update } = contestantSlice.actions

export const selectContestant = (playerId: string | undefined) => (state: RootState) =>
    playerId !== undefined
        ? state.contest.current?.contestants[playerId]
        : undefined

export default contestantSlice.reducer

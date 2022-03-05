import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contest } from '../api/contests'
import { RootState } from '../app/store'
import { getGameAsync } from './gameSlice'

export interface ContestState {
    status: 'loading' | 'idle'
    current: Contest | undefined
    contests: Contest[]
}

const initialState: ContestState = {
    status: 'idle',
    current: undefined,
    contests: []
}

export const createContestAsync = createAsyncThunk(
    'contest/createContest',
    async (gameId: string) => {
        const response = await api.contests.create(gameId)
        return response
    }
)

export const contestSlice = createSlice({
    name: 'contest',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGameAsync.fulfilled, (state, action) => {
                state.contests = Object.values(action.payload.contests)
                if (state.current !== undefined
                    && !state.contests.map(x => x.id).includes(state.current.id)) {
                    throw new Error('Somehow current contest isn\'t in game?')
                }
            })
    }
})

// export const { setGameId, join } = contestSlice.actions
export const selectContestStatus = (state: RootState) => state.contest.current?.status ?? 'complete'


export default contestSlice.reducer

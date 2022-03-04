import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api'
import { RootState } from '../../app/store'
import { createPlayerAsync } from '../lobby/playerSlice'

export interface GameState {
    status: 'loading' | 'idle'
    gameId: string | undefined
    joined: boolean
}

const initialState: GameState = {
    status: 'idle',
    gameId: undefined,
    joined: false
}

export const createGameAsync = createAsyncThunk(
    'game/createGame',
    async () => {
        //TODO error handling / service layer? 
        const { id } = await api.games.create()
        return id
    }
)

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameId: (state, action) => {
            state.gameId = action.payload
        },
        join: (state) => {
            state.joined = true
        },
        leave: (state) => {
            state.gameId = undefined
            state.joined = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGameAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createGameAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
    }
})

export const { setGameId, join } = gameSlice.actions

export const selectGameId = (state: RootState) => state.game.gameId

export default gameSlice.reducer

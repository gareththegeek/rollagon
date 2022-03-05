import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Game } from '../api/games'
import { RootState } from '../app/store'

export interface GameState {
    status: 'loading' | 'idle'
    gameId: string | undefined
    joined: boolean,
    current: Game | undefined
}

const initialState: GameState = {
    status: 'idle',
    gameId: undefined,
    joined: false,
    current: undefined
}

export const createGameAsync = createAsyncThunk(
    'game/createGame',
    async () => {
        //TODO error handling / service layer? 
        const { id } = await api.games.create()
        return id
    }
)

export const getGameAsync = createAsyncThunk(
    'game/getGame',
    async (gameId: string) => {
        const game = await api.games.get(gameId)
        return game
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
            .addCase(getGameAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getGameAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.current = {
                    ...action.payload,
                    players: {},
                    contests: {}
                }
            })
    }
})

export const { setGameId, join } = gameSlice.actions

export const selectGameId = (state: RootState) => state.game.gameId
export const selectGame = (state: RootState) => state.game.current

export default gameSlice.reducer

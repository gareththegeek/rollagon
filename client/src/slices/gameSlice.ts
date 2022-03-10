import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Game } from '../api/games'
import { RootState } from '../app/store'
import * as contest from './contestSlice'
import * as player from './playerSlice'

export interface GameState {
    status: 'loading' | 'idle'
    gameId: string | undefined
    current: Game | undefined
}

const initialState: GameState = {
    status: 'idle',
    gameId: undefined,
    current: undefined
}

export const createGameAsync = createAsyncThunk(
    'game/createGame',
    async () => {
        //TODO error handling / service layer? 
        const { id } = await api.games.create()
        await api.contests.create(id)
        return id
    }
)

export const getGameAsync = createAsyncThunk(
    'game/getGame',
    async (gameId: string, { dispatch }) => {
        const game = await api.games.get(gameId)
        dispatch(player.setGameAsync(game))
        dispatch(contest.setGameAsync(game))
        return game
    }
)

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameId: (state, action) => {
            state.gameId = action.payload
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

export const { setGameId } = gameSlice.actions

export const selectGameId = (state: RootState) => state.game.gameId
export const selectGame = (state: RootState) => state.game.current

export default gameSlice.reducer

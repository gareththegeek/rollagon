import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Game } from '../api/games'
import { RootState } from '../app/store'
import * as contest from './contestSlice'
import * as note from './notesSlice'
import * as player from './playerSlice'

export enum TabType {
    Contests = 'contests',
    Notes = 'notes',
    About = 'about'
}

export interface GameState {
    gameId: string | undefined
    current: Game | undefined,
    tab: TabType
}

const initialState: GameState = {
    gameId: undefined,
    current: undefined,
    tab: TabType.Contests
}

export const createGameAsync = createAsyncThunk(
    'game/createGame',
    async (_, { rejectWithValue }) => {
        try {
            const { id } = await api.games.create()
            await api.contests.create(id)
            return id
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const getGameAsync = createAsyncThunk(
    'game/getGame',
    async (gameId: string, { dispatch, rejectWithValue }) => {
        try {
            const game = await api.games.get(gameId)
            dispatch(player.setGameAsync(game))
            dispatch(contest.setGameAsync(game))
            dispatch(note.setGameAsync(game))
            dispatch(update({
                ...game,
                players: {},
                contests: {}
            }))
            return game
        } catch (e: any) {
            const empty = {
                players: {},
                contests: {}
            } as Game
            dispatch(player.setGameAsync(empty))
            dispatch(contest.setGameAsync(empty))
            dispatch(update(undefined))
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameId: (state, { payload }) => {
            state.gameId = payload
        },
        update: (state, { payload }) => {
            state.current = payload
        },
        setTab: (state, { payload }) => {
            state.tab = payload
        }
    }
})

export const { setGameId, update, setTab } = gameSlice.actions
export const thunks = [
    createGameAsync,
    getGameAsync
]

export const selectGameId = (state: RootState) => state.game.gameId
export const selectGame = (state: RootState) => state.game.current
export const selectTab = (state: RootState) => state.game.tab
export const selectIsContestsTab = (state: RootState) => state.game.tab === TabType.Contests
export const selectIsNotesTab = (state: RootState) => state.game.tab === TabType.Notes
export const selectIsAboutTab = (state: RootState) => state.game.tab === TabType.About

export default gameSlice.reducer

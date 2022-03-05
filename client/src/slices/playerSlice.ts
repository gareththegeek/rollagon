import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Player } from '../api/players'
import { RootState } from '../app/store'
import { getGameAsync } from './gameSlice'

export interface PlayerState {
    status: 'loading' | 'idle'
    isStrife: boolean
    current: Player | undefined
    players: Player[]
}

const initialState: PlayerState = {
    status: 'idle',
    isStrife: false,
    current: undefined,
    players: []
}

export const getPlayersAsync = createAsyncThunk(
    'player/getPlayers',
    async (gameId: string) => {
        //TODO error handling / service layer? 
        return await api.players.get(gameId)
    }
)

const isNewPlayer = (player: Player): boolean => player.id === undefined

export interface JoinHeroArgs {
    gameId: string
    player: Player
}

export const createPlayerAsync = createAsyncThunk(
    'player/joinHero',
    async ({ gameId, player }: JoinHeroArgs) => {
        if (isNewPlayer(player)) {
            return await api.players.create(gameId, player)
        }
        return player
    }
)

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        joinStrife: (state) => {
            state.isStrife = true
            state.current = undefined
        },
        joinHero: (state, action) => {
            state.isStrife = false
            state.current = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPlayersAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getPlayersAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.players = action.payload
            })
            .addCase(createPlayerAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createPlayerAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(getGameAsync.fulfilled, (state, action) => {
                state.players = Object.values(action.payload.players)
            })
    }
})

export const { joinStrife, joinHero } = playerSlice.actions

export const selectPlayers = (state: RootState) => state.player.players
export const selectIsStrifePlayer = (state: RootState) => state.player.isStrife

export default playerSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Player } from '../api/players'
import { RootState } from '../app/store'
import * as ws from '../app/websocket'
import { getGameAsync } from './gameSlice'
import { subscribeAsync as subscribeContestAsync } from './contestSlice'

export interface PlayerState {
    status: 'loading' | 'idle'
    joined: boolean
    isStrife: boolean
    current: Player | undefined
    players: Player[]
}

const initialState: PlayerState = {
    status: 'idle',
    joined: false,
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

export const joinAsync = createAsyncThunk(
    'player/join',
    async (gameId: string, { dispatch }) => {
        await ws.join(gameId)
        ws.subscribe(dispatch, 'player', ['add', 'update', 'remove'])
        await dispatch(subscribeContestAsync())
        await dispatch(join())
    }
)

// export const leaveAsync = createAsyncThunk(
//     'player/leave',
//     async (gameId: string, { dispatch }) => {
//         //TODO
//     }
// )

export const joinStrifeAsync = createAsyncThunk(
    'player/joinStrife',
    async (gameId: string, { dispatch }) => {
        await dispatch(joinAsync(gameId))
        await dispatch(joinStrife())
    }
)

const isNewPlayer = (player: Player): boolean => player.id === undefined

export interface JoinHeroArgs {
    gameId: string
    player: Player
}

export const joinHeroAsync = createAsyncThunk(
    'player/joinHero',
    async ({ gameId, player }: JoinHeroArgs, { dispatch }) => {
        if (isNewPlayer(player)) {
            player = await api.players.create(gameId, player)
        }
        await dispatch(joinAsync(gameId))
        await dispatch(joinHero(player))
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
        },
        join: (state) => {
            state.joined = true
        },
        leave: (state) => {
            state.joined = false
            state.isStrife = false
            state.current = undefined
        },
        add: (state, { payload: { value } }) => {
            if (!state.players.some(x => x.id === value.id)) {
                state.players.push(value)
            }
        },
        update: (state, { payload: { value } }) => {
            const idx = state.players.findIndex(x => x.id === value.payload.id)
            state.players[idx] = value
        },
        remove: (state, { payload: { value } }) => {
            const idx = state.players.findIndex(x => x.id === value.payload.id)
            state.players.splice(idx, 1)
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
            .addCase(joinHeroAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(joinHeroAsync.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(getGameAsync.fulfilled, (state, action) => {
                state.players = Object.values(action.payload.players)
            })
    }
})

export const { join, joinStrife, joinHero, add, update, remove } = playerSlice.actions

export const selectPlayers = (state: RootState) => state.player.players
export const selectIsStrifePlayer = (state: RootState) => state.player.isStrife

export default playerSlice.reducer

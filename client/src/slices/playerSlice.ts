import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Player } from '../api/players'
import { AppDispatch, RootState } from '../app/store'
import * as ws from '../app/websocket'
import { subscribeAsync as subscribeContestAsync } from './contestSlice'
import { subscribeAsync as subscribeContestantAsync } from './contestantSlice'
import { subscribeAsync as subscribeStrifeAsync } from './strifeSlice'
import { Game } from '../api/games'

export interface PlayerState {
    joined: boolean
    isStrife: boolean
    current: Player | undefined
    players: Player[]
    connected: string[]
}

const initialState: PlayerState = {
    joined: false,
    isStrife: false,
    current: undefined,
    players: [],
    connected: []
}

export const getPlayersAsync = createAsyncThunk(
    'player/getPlayers',
    async (gameId: string, { dispatch, rejectWithValue }) => {
        try {
            const players = await api.players.get(gameId)
            dispatch(set(players))
            return players
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export interface JoinProps {
    gameId: string
    playerId: string
}

export const joinAsync = createAsyncThunk(
    'player/join',
    async ({ gameId, playerId }: JoinProps, { dispatch, rejectWithValue }) => {
        try {
            ws.subscribe(dispatch as AppDispatch, 'player', [
                { name: 'add', handler: addAsync },
                { name: 'update', handler: updateAsync },
                { name: 'remove', handler: removeAsync }
            ])
            ws.subscribe(dispatch as AppDispatch, 'connections', [
                { name: 'update', handler: updateConnectionsAsync }
            ])
            await dispatch(subscribeContestAsync())
            await dispatch(subscribeContestantAsync())
            await dispatch(subscribeStrifeAsync())
            await dispatch(join())
            
            await ws.join(gameId, playerId)
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
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
    async (gameId: string, { dispatch, rejectWithValue }) => {
        try {
            await dispatch(joinAsync({ gameId, playerId: 'strife' }))
            await dispatch(joinStrife())
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

const isNewPlayer = (player: Player): boolean => player.id === undefined

export interface JoinHeroArgs {
    gameId: string
    player: Player
}

export const joinHeroAsync = createAsyncThunk(
    'player/joinHero',
    async ({ gameId, player }: JoinHeroArgs, { dispatch, rejectWithValue }) => {
        try {
            if (isNewPlayer(player)) {
                player = await api.players.create(gameId, player)
            }
            await dispatch(joinAsync({ gameId, playerId: player.id ?? '' }))
            await dispatch(joinHero(player))
            return player
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const setGameAsync = createAsyncThunk(
    'player/setGame',
    async (game: Game, { dispatch }) => {
        dispatch(set(game.players))
    }
)

export const addAsync = createAsyncThunk(
    'player/addAsync',
    async ({ value }: ws.EventArgs<Player>, { dispatch }) => {
        dispatch(add(value))
    }
)

export const updateAsync = createAsyncThunk(
    'player/updateAsync',
    async ({ value }: ws.EventArgs<Player>, { dispatch }) => {
        dispatch(update(value))
    }
)

export const removeAsync = createAsyncThunk(
    'player/removeAsync',
    async ({ value }: ws.EventArgs<Player>, { dispatch }) => {
        dispatch(remove(value))
    }
)

export const updateConnectionsAsync = createAsyncThunk(
    'player/updateConnectionsAsync',
    async ({ value }: ws.EventArgs<string[]>, { dispatch }) => {
        dispatch(setConnections(value))
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
        set: (state, { payload }) => {
            state.players = Object.values(payload)
        },
        add: (state, { payload }) => {
            if (!state.players.some(x => x.id === payload.id)) {
                state.players.push(payload)
            }
        },
        update: (state, { payload }) => {
            const idx = state.players.findIndex(x => x.id === payload.id)
            state.players[idx] = payload
        },
        remove: (state, { payload }) => {
            const idx = state.players.findIndex(x => x.id === payload.id)
            state.players.splice(idx, 1)
        },
        setConnections: (state, { payload }) => {
            state.connected = payload
        }
    }
})

export const { join, joinStrife, joinHero, set, add, update, remove, setConnections } = playerSlice.actions
export const thunks = [
    getPlayersAsync,
    joinAsync,
    joinStrifeAsync,
    joinHeroAsync
]

export const selectPlayer = (playerId: string) =>
    (state: RootState) => state.player.players.find(x => x.id === playerId)
export const selectPlayers = (state: RootState) => state.player.players
export const selectConnections = (state: RootState) => state.player.connected
export const selectIsStrifePlayer = (state: RootState) => state.player.isStrife
export const selectPlayerId = (state: RootState) => state.player.current?.id

export default playerSlice.reducer

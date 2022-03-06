import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Player } from '../api/players'
import { RootState } from '../app/store'
import { websocketJoin, websocketSubscribe } from '../app/websocket'
import { getGameAsync } from './gameSlice'

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

export const subscribeAsync = createAsyncThunk(
    'player/subscribe',
    async (gameId: string, { dispatch }) => {
        websocketSubscribe(dispatch, gameId, 'players.add', addPlayer)
        websocketSubscribe(dispatch, gameId, 'players.update', updatePlayer)
        websocketSubscribe(dispatch, gameId, 'players.remove', removePlayer)
    }
)

export const joinAsync = createAsyncThunk(
    'player/join',
    async (gameId: string, { dispatch }) => {
        await websocketJoin(dispatch, gameId)
        await dispatch(join())
        await dispatch(subscribeAsync(gameId))
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
            return await api.players.create(gameId, player)
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
        addPlayer: (state, { payload: { value } }) => {
            state.players.push(value)
        },
        updatePlayer: (state, { payload: { value } }) => {
            const idx = state.players.findIndex(x => x.id === value.payload.id)
            state.players[idx] = value
        },
        removePlayer: (state, { payload: { value } }) => {
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

export const { join, joinStrife, joinHero, addPlayer, updatePlayer, removePlayer } = playerSlice.actions

export const selectPlayers = (state: RootState) => state.player.players
export const selectIsStrifePlayer = (state: RootState) => state.player.isStrife

export default playerSlice.reducer

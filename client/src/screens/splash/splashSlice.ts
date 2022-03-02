import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'

export interface SplashState {
    status: 'loading' | 'idle'
    gameId: string | undefined
}

const initialState: SplashState = {
    status: 'idle',
    gameId: undefined
}

const API_FQDN = process.env.REACT_APP_API_FQDN ?? ''

export const createGameAsync = createAsyncThunk(
    'splash/createGame',
    async () => {
        //TODO error handling / service layer? 
        const response = await axios.post(`${API_FQDN}/api/games`)
        const { id } = response.data
        return id
    }
)

export const splashSlice = createSlice({
    name: 'splash',
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
            .addCase(createGameAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.gameId = action.payload
            })
    }
})

export const { setGameId } = splashSlice.actions;

export const selectGameId = (state: RootState) => state.splash.gameId

export default splashSlice.reducer

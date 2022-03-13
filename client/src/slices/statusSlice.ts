import { ActionReducerMapBuilder, AsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../app/store'
import * as contestant from './contestantSlice'
import * as contest from './contestSlice'
import * as game from './gameSlice'
import * as player from './playerSlice'
import * as strife from './strifeSlice'

export interface Slice {
    thunks: AsyncThunk<any, any, {}>[]
}

const slices: Slice[] = [
    contestant,
    contest,
    game,
    player,
    strife
]

type Error = {
    timestamp: string
    message: string | string[]
}

export interface StatusState {
    loadingCount: number
    errors: Error[]
}

const initialState: StatusState = {
    loadingCount: 0,
    errors: []
}

export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loadingCount += 1
        },
        setSuccess: (state) => {
            state.loadingCount -= 1
        },
        setError: (state, { payload }) => {
            state.loadingCount -= 1
            state.errors.push({
                timestamp: new Date().toISOString(),
                message: payload
            })
        },
        dismissError: (state, { payload }) => {
            const idx = state.errors.findIndex(x => x.timestamp === payload)
            state.errors.splice(idx, 1)
        }
    },
    extraReducers: (builder) => {
        bindThunks(builder, slices.flatMap(x => x.thunks))
    }
})

const bindThunks = (builder: ActionReducerMapBuilder<StatusState>, thunks: AsyncThunk<any, any, {}>[]) => {
    for (const thunk of thunks) {
        builder
            .addCase(thunk.pending, (state) => {
                statusSlice.caseReducers.setLoading(state)
            })
            .addCase(thunk.fulfilled, (state) => {
                statusSlice.caseReducers.setSuccess(state)
            })
            .addCase(thunk.rejected, (state, action) => {
                statusSlice.caseReducers.setError(state, action)
            })
    }
}

export const { setLoading, setSuccess, setError, dismissError } = statusSlice.actions

export const selectIsLoading = (state: RootState) => state.status.loadingCount > 0
export const selectErrors = (state: RootState) => state.status.errors

export default statusSlice.reducer

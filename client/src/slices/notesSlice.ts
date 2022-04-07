import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { Contest } from '../api/contests'
import { Game } from '../api/games'
import { Note } from '../api/notes'
import { AppDispatch, RootState } from '../app/store'
import * as ws from '../app/websocket'

export interface NoteArgs {
    gameId: string
    noteId: string
}

export interface CreateNoteArgs {
    gameId: string
    text: string
}

export const createNoteAsync = createAsyncThunk(
    'note/createNote',
    async ({ gameId, text }: CreateNoteArgs, { rejectWithValue }) => {
        try {
            return await api.notes.create(gameId, text)
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const removeNoteAsync = createAsyncThunk(
    'note/removeNote',
    async ({ gameId, noteId }: NoteArgs, { dispatch, getState, rejectWithValue }) => {
        const note = selectNote(getState() as RootState, noteId)
        try {
            await dispatch(remove({ noteId }))
            await api.notes.remove(gameId, noteId)
        } catch (e: any) {
            await dispatch(add(note))
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const subscribeAsync = createAsyncThunk(
    'note/subscribe',
    async (_, { dispatch }) => {
        ws.subscribe(dispatch as AppDispatch, 'note', [
            { name: 'add', handler: addAsync },
            { name: 'remove', handler: removeAsync }
        ])
    }
)

export const setGameAsync = createAsyncThunk(
    'contest/setGame',
    async ({ notes }: Game, { dispatch }) => {
        dispatch(set(notes))
    }
)

export const addAsync = createAsyncThunk(
    'note/addAsync',
    async ({ value }: ws.EventArgs<Contest>, { dispatch }) => {
        dispatch(add(value))
    }
)

export const removeAsync = createAsyncThunk(
    'note/removeAsync',
    async ({ params }: ws.EventArgs<Note>, { dispatch }) => {
        dispatch(remove(params))
    }
)

export interface NoteState {
    notes: Record<string, Note>
}

const initialState: NoteState = {
    notes: {}
}

export const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        add: (state, { payload }) => {
            state.notes[payload.id] = payload
        },
        remove: (state, { payload }) => {
            delete state.notes[payload.noteId]
        },
        set: (state, { payload }) => {
            state.notes = payload
        }
    }
})

export const { add, remove, set } = noteSlice.actions
export const thunks = [
    createNoteAsync,
    removeNoteAsync
]

export const selectNote = (state: RootState, noteId: string) => state.note.notes[noteId]
export const selectNotes = (state: RootState) => Object.values(state.note.notes)

export default noteSlice.reducer

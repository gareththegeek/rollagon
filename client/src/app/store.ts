import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import contestReducer from '../slices/contestSlice'
import contestantReducer from '../slices/contestantSlice'
import gameReducer from '../slices/gameSlice'
import noteReducer from '../slices/notesSlice'
import playerReducer from '../slices/playerSlice'
import statusReducer from '../slices/statusSlice'
import strifeReducer from '../slices/strifeSlice'
import themeReducer from '../slices/themeSlice'

export const store = configureStore({
  reducer: {
    contest: contestReducer,
    contestant: contestantReducer,
    game: gameReducer,
    note: noteReducer,
    player: playerReducer,
    status: statusReducer,
    strife: strifeReducer,
    theme: themeReducer
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

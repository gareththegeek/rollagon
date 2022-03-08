import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import contestReducer from '../slices/contestSlice'
import contestantReducer from '../slices/contestantSlice'
import gameReducer from '../slices/gameSlice'
import playerReducer from '../slices/playerSlice'
import strifeReducer from '../slices/strifeSlice'

export const store = configureStore({
  reducer: {
    contest: contestReducer,
    contestant: contestantReducer,
    game: gameReducer,
    player: playerReducer,
    strife: strifeReducer
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

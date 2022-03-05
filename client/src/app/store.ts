import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice'
import contestReducer from '../slices/contestSlice'
import playerReducer from '../slices/playerSlice'
import gameReducer from '../slices/gameSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    contest: contestReducer,
    player: playerReducer,
    game: gameReducer
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

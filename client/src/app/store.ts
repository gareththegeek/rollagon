import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
//import { createBrowserHistory } from 'history';
import counterReducer from '../features/counter/counterSlice'
import playerReducer from '../screens/lobby/playerSlice'
import gameReducer from '../screens/splash/gameSlice'
//export const history = createBrowserHistory()

export const store = configureStore({
  reducer: {
    counter: counterReducer,
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

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import counterReducer from '../features/counter/counterSlice'
import splashReducer from '../screens/splash/splashSlice'
export const history = createBrowserHistory()

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    splash: splashReducer
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

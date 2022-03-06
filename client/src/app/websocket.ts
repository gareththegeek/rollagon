import { ActionCreatorWithPayload, AnyAction, Dispatch } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import { API_FQDN } from '../api/constants'

export const websocketSubscribe = (
    dispatch: Dispatch,
    gameId: string,
    event: string,
    action: ActionCreatorWithPayload<any>) => {
    dispatch({
        type: 'UNUSED',
        gameId,
        event,
        handle: (data: unknown) => dispatch(action(data))
    })
}

export const websocketJoin = (
    dispatch: Dispatch,
    gameId: string
) => {
    dispatch({
        type: 'UNUSED',
        gameId,
        event: 'players.join',
        join: true
    })
}

export const websocketLeave = (
    dispatch: Dispatch,
    gameId: string
) => {
    dispatch({
        type: 'UNUSED',
        gameId,
        event: 'players.leave',
        leave: true
    })
}

//https://nmajor.com/posts/using-socket-io-with-redux-websocket-redux-middleware
const middleware = () => {
    const url = new URL(API_FQDN)
    url.protocol = 'ws'
    const socket = io(url.origin)

    return ({ dispatch }: { dispatch: Dispatch }) => (next: Dispatch) => (action: AnyAction) => {
        if (typeof action === 'function') {
            return next(action)
        }

        const {
            event,
            gameId,
            join,
            leave,
            handle,
            ...rest
        } = action

        if (event === undefined) {
            return next(action)
        }

        if (leave !== undefined) {
            socket.emit('players.leave', { gameId })
            socket.removeAllListeners()
            return
        }

        if (join !== undefined) {
            socket.emit('players.join', { gameId })
            return
        }

        if (typeof handle === 'string') {
            socket.on(event, (result: unknown) => dispatch({ ...rest, type: handle, result }))
        }

        return socket.on(event, handle)
    }
}

export default middleware

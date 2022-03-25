import { AsyncThunk } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import { API_FQDN } from '../api/constants'
import { setConnected } from '../slices/statusSlice'
import { AppDispatch, store } from './store'

export interface EventArgs<T> {
    params?: any | undefined
    value: T
}

let origin = API_FQDN
if (origin.indexOf('http') >= 0) {
    const url = new URL(API_FQDN)
    url.protocol = 'ws'
    origin = url.origin
}
const socket = io(origin)
let interval: NodeJS.Timeout | undefined = undefined

socket.on('connect', () => {
    console.info('Websocket connected')
    if (interval !== undefined) {
        clearInterval(interval)
        interval = undefined
    }
    store.dispatch(setConnected(true))
})

socket.on('disconnect', () => {
    store.dispatch(setConnected(false))
    console.warn('Lost websocket connection')
    interval = setInterval(() => {
        console.info('Attempting to reconnect')
        socket.connect()
    }, 2000)
})

export const join = (gameId: string) => {
    socket.emit('players.join', { gameId })
}

export const leave = (gameId: string) => {
    socket.emit('players.leave', { gameId })
    socket.removeAllListeners()
}

export interface WebSocketBinding {
    name: string,
    handler: AsyncThunk<any, any, {}>
}

export const subscribe = (dispatch: AppDispatch, topic: string, events: WebSocketBinding[]) => {
    events.forEach(({ name, handler }) => {
        const actionType = `${topic}/${name}Async`
        const eventType = `${topic}.${name}`
        socket.on(eventType, (result: unknown) => {
            if (process.env.NODE_ENV === 'development') {
                console.info(`${eventType} -> ${actionType}: ${JSON.stringify(result)}`)
            }
            dispatch(handler(result))
        })
    })
}

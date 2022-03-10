import { AsyncThunk } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import { API_FQDN } from '../api/constants'
import { AppDispatch } from './store'

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
            console.info(`${eventType} -> ${actionType}: ${JSON.stringify(result)}`)
            dispatch(handler(result))
        })
    })
}

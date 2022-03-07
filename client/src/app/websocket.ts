import { Dispatch } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import { API_FQDN } from '../api/constants'

const url = new URL(API_FQDN)
url.protocol = 'ws'
const socket = io(url.origin)

export const join = (gameId: string) => {
    socket.emit('players.join', { gameId })
}

export const leave = (gameId: string) => {
    socket.emit('players.leave', { gameId })
    socket.removeAllListeners()
}

export const subscribe = (dispatch: Dispatch, topic: string, events: string[]) => {
    events.forEach(event => {
        const actionType = `${topic}/${event}`
        const eventType = `${topic}.${event}`
        socket.on(eventType, (result: unknown) => {
            console.info(`${eventType} -> ${actionType}: ${JSON.stringify(result)}`)
            dispatch({ type: actionType, payload: result })
        })
    })
}

import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

export let socket: Server

export const getSocket = () => socket

const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? '*'

export const configure = (server: HttpServer): void => {
    const io = new Server(server, {
        perMessageDeflate: false,
        cors: {
            origin: CORS_ORIGIN
        }
    })
    socket = io
}

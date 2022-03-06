import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { socketConnectionHandler } from './services/players'

export let socketServer: Server

export const getSocketServer = () => socketServer

const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? '*'

export const configure = (server: HttpServer): void => {
    const io = new Server(server, {
        perMessageDeflate: false,
        cors: {
            origin: CORS_ORIGIN
        }
    })

    io.on('connection', socketConnectionHandler)

    socketServer = io
}

import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

export let Socket: Server

const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? '*'

export const configure = (server: HttpServer): void => {
    const io = new Server(server, {
        perMessageDeflate: false,
        cors: {
            origin: CORS_ORIGIN
        }
    })
    Socket = io
}

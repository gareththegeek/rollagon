jest.mock('../../src/websockets')
import { Server } from 'socket.io'
import * as singleton from '../../src/websockets'

export interface MockServer {
    send: (topic: string, data: any) => void
}

export const mockSocket = (): MockServer => {
    const mock = {
        send: jest.fn()
    } as unknown as Server
    jest.spyOn(singleton, 'getSocket').mockReturnValue(mock)
    return mock
}

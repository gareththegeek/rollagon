jest.mock('../../src/websockets')
import { Server } from 'socket.io'
import * as singleton from '../../src/websockets'

export interface MockRoom {
    emit: (topic: string, data: any) => void
}

export interface MockServer {
    to: jest.Mock<MockRoom, [string]>
}

export const mockSocket = (): MockServer => {
    const room = {
        emit: jest.fn()
    }
    const mock = {
        to: jest.fn().mockReturnValue(room)
    }
    jest.spyOn(singleton, 'getSocket').mockReturnValue(mock as unknown as Server)
    return mock
}

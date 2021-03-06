import { mockRepo, MockRepository } from '../mock/repo'
import { mockGenerateId } from '../mock/generateId'
import { mockGetTimestamp } from '../mock/getTimestamp'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGame } from '../mock/game'
import request from 'supertest'
import app from '../../src/server'
import { ObjectId } from 'mongodb'

describe('POST /api/games', () => {
    let repo: MockRepository
    let generateId: jest.SpyInstance<string, []>
    let getTimestamp: jest.SpyInstance<string, []>
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'

    beforeEach(() => {
        repo = mockRepo()
        generateId = mockGenerateId()
        getTimestamp = mockGetTimestamp()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.resetModules()
    })

    it('returns a new game', (done) => {
        const expected = mockGame(gameId)
        getTimestamp.mockReturnValue(expected.createdOn)
        generateId.mockReturnValue(gameId)
        const body = {}

        repo.getById.mockResolvedValue(expected)
        repo.insert.mockResolvedValue(new ObjectId("123456789012345678901234"))

        request(app)
            .post(`/api/games`)
            .send(body)
            .expect(200, expected)
            .expect(() => {
                expect(repo.insert).toHaveBeenCalledWith(expected)
            })
            .end(done)
    })

    it('does not send the new game via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)

        const expected = mockGame(gameId)
        getTimestamp.mockReturnValue(expected.createdOn)
        generateId.mockReturnValue(gameId)
        const body = {}

        repo.getById.mockResolvedValue(expected)
        repo.insert.mockResolvedValue(new ObjectId("123456789012345678901234"))

        request(app)
            .post(`/api/games`)
            .send(body)
            .expect(() => {
                expect(socket.to).not.toHaveBeenCalled()
                expect(room.emit).not.toHaveBeenCalled()
            })
            .end(done)
    })

    it('returns 500 error if game fails to persist', (done) => {
        const expected = mockGame(gameId)
        generateId.mockReturnValue(gameId)
        const body = {}

        repo.getById.mockResolvedValue(expected)
        repo.insert.mockResolvedValue(undefined)

        request(app)
            .post(`/api/games`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data into database' })
            .end(done)
    })
})

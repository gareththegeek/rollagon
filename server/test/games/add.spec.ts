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

    it('returns a new game with specified name', (done) => {
        const expected = mockGame(gameId)
        getTimestamp.mockReturnValue(expected.createdOn)
        generateId.mockReturnValue(gameId)
        const body = {
            name: expected.name
        }

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

    it('sends the new game via web socket', (done) => {
        const expected = mockGame(gameId)
        getTimestamp.mockReturnValue(expected.createdOn)
        generateId.mockReturnValue(gameId)
        const body = {
            name: expected.name
        }

        repo.getById.mockResolvedValue(expected)
        repo.insert.mockResolvedValue(new ObjectId("123456789012345678901234"))

        request(app)
            .post(`/api/games`)
            .send(body)
            .expect(() => {
                expect(socket.send).toHaveBeenCalledWith('games.add', { params: {}, value: expected })
            })
            .end(done)
    })

    it('trims whitespace from specified name', (done) => {
        const expected = mockGame(gameId)
        getTimestamp.mockReturnValue(expected.createdOn)
        generateId.mockReturnValue(gameId)
        const body = {
            name: ` ${expected.name} `
        }

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

    it('returns 500 error if game fails to persist', (done) => {
        const expected = mockGame(gameId)
        generateId.mockReturnValue(gameId)
        const body = {
            name: expected.name
        }

        repo.getById.mockResolvedValue(expected)
        repo.insert.mockResolvedValue(undefined)

        request(app)
            .post(`/api/games`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data into database' })
            .end(done)
    });

    ['Has"quotes', 'Contains .dots', 'Has$dollar', 'Has{brace', 'Has}otherbrace'].forEach(name => {
        it(`returns 400 if invalid name is specified (${name})`, (done) => {
            const body = { name }

            request(app)
                .post('/api/games')
                .send(body)
                .expect(400, {
                    message: [
                        `"name" with value "${name}" fails to match the required pattern: /^[^"|.|$|{|}]+$/`
                    ]
                })
                .end(done)
        })
    })

    it('returns 400 if no name specified', (done) => {
        const body = {}

        request(app)
            .post('/api/games')
            .send(body)
            .expect(400, { message: ['"name" is required'] })
            .end(done)
    })
})

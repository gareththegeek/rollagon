import { mockRepo, MockRepository } from '../mock/repo'
import { mockGenerateId } from '../mock/generateId'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGame } from '../mock/game'
import { mockPlayer } from '../mock/player'
import request from 'supertest'
import app from '../../src/server'

describe('POST /api/games/:gameId/players', () => {
    let repo: MockRepository
    let generateId: jest.SpyInstance<string, []>
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const playerId = '123123123123123123123'

    beforeEach(() => {
        repo = mockRepo()
        generateId = mockGenerateId()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns a new player with specified name', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)

        generateId.mockReturnValue(playerId)
        const body = {
            name: expected.name
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/players`)
            .send(body)
            .expect(200, expected)
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `players.${playerId}`, expected)
            })
            .end(done)
    })

    it('sends the new player via web socket', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)

        generateId.mockReturnValue(playerId)
        const body = {
            name: expected.name
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/players`)
            .send(body)
            .expect(() => {
                expect(socket.send).toHaveBeenCalledWith('players.add', { params: { gameId }, value: expected })
            })
            .end(done)
    })

    it('trims whitespace from specified name', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)

        generateId.mockReturnValue(playerId)
        const body = {
            name: ` ${expected.name} `
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/players`)
            .send(body)
            .expect(200, expected)
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `players.${playerId}`, expected)
            })
            .end(done)
    })

    it('returns 500 error if player fails to persist', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)

        generateId.mockReturnValue(playerId)
        const body = {
            name: ` ${expected.name} `
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/players`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    });

    ['Has"quotes', 'Contains .dots', 'Has$dollar', 'Has{brace', 'Has}otherbrace'].forEach(name => {
        it(`returns 400 if invalid name is specified (${name})`, (done) => {
            const body = { name }

            request(app)
                .post(`/api/games/${encodeURI(gameId)}/players`)
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
            .post(`/api/games/${encodeURI(gameId)}/players`)
            .send(body)
            .expect(400, { message: ['"name" is required'] })
            .end(done)
    })

    it('returns 404 if no game found with specified id', (done) => {
        const body = { name: 'hello' }

        repo.getById.mockResolvedValue(undefined)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/players`)
            .send(body)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })
})

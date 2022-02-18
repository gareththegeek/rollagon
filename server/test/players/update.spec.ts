import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGame } from '../mock/game'
import { mockPlayer } from '../mock/player'
import request from 'supertest'
import app from '../../src/server'

describe('PUT /api/games/:gameId/players/:playerId', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const playerId = '123123123123123123123'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('updates specified player name', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)
        game.players[playerId] = expected

        const body = {
            name: expected.name
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(200, expected)
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `players.${playerId}`, expected)
            })
            .end(done)
    })

    it('sends the updated player via web socket', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)
        game.players[playerId] = expected

        const body = {
            name: expected.name
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(() => {
                expect(socket.send).toHaveBeenCalledWith('players.update', { params: { gameId, playerId }, value: expected })
            })
            .end(done)
    })

    it('trims whitespace from specified name', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)
        game.players[playerId] = expected

        const body = {
            name: ` ${expected.name} `
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
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
        game.players[playerId] = expected

        const body = {
            name: ` ${expected.name} `
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    })

    it('returns 400 if no name specified', (done) => {
        const body = {}

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(400, { message: ['"name" is required'] })
            .end(done)
    })
})

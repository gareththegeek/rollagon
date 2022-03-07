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
    const timestamp = '2022-01-01T00:00:01.000Z'
    const newerTimestamp = '2022-01-01T00:00:02.000Z'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.resetModules()
    })

    it('updates specified player name', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)
        expected.timestamp = timestamp
        game.players[playerId] = expected

        const body = {
            timestamp,
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

    it('does not update specified player if timestamp is older than database timestamp', (done) => {
        const game = mockGame(gameId)
        const existing = mockPlayer(playerId)
        existing.timestamp = newerTimestamp
        game.players[playerId] = existing

        const body = {
            timestamp,
            name: existing.name
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(200, existing)
            .expect(() => {
                expect(repo.updateNested).not.toHaveBeenCalledWith(gameId, `players.${playerId}`, expect.any(Object))
            })
            .end(done)
    })

    it('sends the updated player via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)

        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)
        expected.timestamp = timestamp
        game.players[playerId] = expected

        const body = {
            timestamp,
            name: expected.name
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
                expect(room.emit).toHaveBeenCalledWith('player.update', { params: { gameId, playerId }, value: expected })
            })
            .end(done)
    })

    it('trims whitespace from specified name', (done) => {
        const game = mockGame(gameId)
        const expected = mockPlayer(playerId)
        expected.timestamp = timestamp
        game.players[playerId] = expected

        const body = {
            timestamp,
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
            timestamp,
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
        const body = { timestamp }

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(400, { message: ['"name" is required'] })
            .end(done)
    })

    it('returns 400 if no timestamp specified', (done) => {
        const body = { name: 'foo' }

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId)}`)
            .send(body)
            .expect(400, { message: ['"timestamp" is required'] })
            .end(done)
    })
})

import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithPlayers } from '../mock/game'

describe('DELETE /api/games/:gameId/players/:playerId', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const playerId1 = '123123123123123123123'
    const playerId2 = '321321321312321321321'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
		jest.resetModules()
    })

    it('deletes player with specified id', (done) => {
        const game = mockGameWithPlayers(gameId, [playerId1, playerId2])

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId2)}`)
            .expect(200, {})
            .expect(() => {
                expect(repo.deleteNested).toHaveBeenCalledWith(gameId, `players.${playerId2}`)
            })
            .end(done)
    })

    it('sends notification of deleted player via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)
        
        const game = mockGameWithPlayers(gameId, [playerId1, playerId2])

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId2)}`)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
				expect(room.emit).toHaveBeenCalledWith(
                    'players.remove',
                    { params: { gameId, playerId: playerId2 } }
                )
            })
            .end(done)
    })

    it('returns 404 error if game with specified id not found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId2)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 error if player with specified id not found', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId2)}`)
            .expect(404, { message: `Could not find a player with game id '${gameId}' and player id '${playerId2}'` })
            .end(done)
    })

    it('returns 400 error if invalid game id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI('invalid')}/players/${encodeURI(playerId2)}`)
            .expect(400, {
                message: [
                    '"game id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 400 error if invalid player id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/players/${encodeURI('invalid')}`)
            .expect(400, {
                message: [
                    '"player id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 500 error if player fails to delete', (done) => {
        const expected = mockGameWithPlayers(gameId, [playerId1, playerId2])

        repo.getById.mockResolvedValue(expected)
        repo.deleteNested.mockResolvedValue(false)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId1)}`)
            .expect(500, { message: 'Unexpectedly failed to delete data from database' })
            .end(done)
    })
})

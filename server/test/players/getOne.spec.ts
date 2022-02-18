import { mockRepo, MockRepository } from '../mock/repo'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithPlayers } from '../mock/game'

describe('GET /api/games/:gameId/players/:playerId', () => {
    let repo: MockRepository

    const gameId = '1234567890ABCDEfghijk'
    const playerId1 = '111111111111111111111'
    const playerId2 = '222222222222222222222'

    beforeEach(() => {
        repo = mockRepo()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns player with specified id from specified game', (done) => {
        const game = mockGameWithPlayers(gameId, [playerId1, playerId2])
        const expected = game.players[playerId2]

        repo.getById.mockResolvedValue(game)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId2)}`)
            .expect(200, expected)
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('returns 404 if no game with specified id found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId2)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 if no player with specified id found', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/players/${encodeURI(playerId2)}`)
            .expect(404, { message: `Could not find a player with game id '${gameId}' and player id '${playerId2}'` })
            .end(done)
    })
})

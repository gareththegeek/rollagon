import { mockRepo, MockRepository } from '../mock/repo'
import request from 'supertest'
import app from '../../src/server'
import { mockGameWithPlayers } from '../mock/game'

describe('GET /api/games/:gameId/players', () => {
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

    it('returns players for specified game', (done) => {
        const game = mockGameWithPlayers(gameId, [playerId1, playerId2])
        const expected = Object.values(game.players)

        repo.getById.mockResolvedValue(game)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/players`)
            .expect(200, expected)
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('returns 404 if no game with specified id found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/players`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })
})

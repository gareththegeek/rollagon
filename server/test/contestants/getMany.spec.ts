import { mockRepo, MockRepository } from '../mock/repo'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithContestsAndPlayers } from '../mock/game'

describe('GET /api/games/:gameId/contests/:contestId/contestants', () => {
    let repo: MockRepository

    const gameId = '1234567890ABCDEfghijk'
    const contestId = 'abcabcabcabcabcabcabc'
    const playerId1 = '111111111111111111111'
    const playerId2 = '222222222222222222222'

    beforeEach(() => {
        repo = mockRepo()
    })

    afterEach(() => {
        jest.resetAllMocks()
		jest.resetModules()
    })

    it('returns contestants for specified contest', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId1, playerId2])
        const expected = Object.values(game.contests[contestId]!.contestants)

        repo.getById.mockResolvedValue(game)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .expect(200, expected)
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('returns 404 if no game found with specified id', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 if no contest found with specified id', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .expect(404, { message: `Could not find contest with id '${contestId}'` })
            .end(done)
    })
})

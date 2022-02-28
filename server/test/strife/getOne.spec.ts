import { mockRepo, MockRepository } from '../mock/repo'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithContests } from '../mock/game'
import { mockStrife } from '../mock/strife'
import { removeOptional } from '../removeOptional'

describe('GET /api/games/:gameId/contests/:contestId/strife', () => {
    let repo: MockRepository

    const gameId = '1234567890ABCDEfghijk'
    const contestId = '333333333333333333333'

    beforeEach(() => {
        repo = mockRepo()
    })

    afterEach(() => {
        jest.resetAllMocks()
		jest.resetModules()
    })

    it('returns strife for contest with specified id from specified game', (done) => {
        const game = mockGameWithContests(gameId, [contestId])
        const expected = mockStrife()
        game.contests[contestId]!.strife = expected

        repo.getById.mockResolvedValue(game)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('returns 404 if no game with specified id found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 if no contest with specified id found', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
            .expect(404, { message: `Could not find contest with id '${contestId}'` })
            .end(done)
    })
})

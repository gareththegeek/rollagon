import { mockRepo, MockRepository } from '../mock/repo'
import { removeOptional } from '../removeOptional'
import request from 'supertest'
import app from '../../src/server'
import { mockGameWithContests } from '../mock/game'

describe('GET /api/games/:gameId/contests', () => {
    let repo: MockRepository

    const gameId = '1234567890ABCDEfghijk'
    const contestId1 = '111111111111111111111'
    const contestId2 = '222222222222222222222'

    beforeEach(() => {
        repo = mockRepo()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns contests for specified game', (done) => {
        const game = mockGameWithContests(gameId, [contestId1, contestId2])
        const expected = Object.values(game.contests)

        repo.getById.mockResolvedValue(game)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests`)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('returns 404 if no game with specified id found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })
})

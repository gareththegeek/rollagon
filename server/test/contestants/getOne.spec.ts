import { mockRepo, MockRepository } from '../mock/repo'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithContests, mockGameWithContestsAndPlayers } from '../mock/game'
import { mockContestant } from '../mock/contestant'
import { removeOptional } from '../removeOptional'

describe('GET /api/games/:gameId/contests/:contestId/contestants/:contestantId', () => {
    let repo: MockRepository

    const gameId = '1234567890ABCDEfghijk'
    const contestId = '333333333333333333333'
    const playerId = 'abcabcabcabcabcabcabc'

    beforeEach(() => {
        repo = mockRepo()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns specified contestant for contest with specified id from specified game', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId, '123123123123123123123'])
        const expected = mockContestant(playerId)
        game.contests[contestId]!.contestants[playerId]! = expected

        repo.getById.mockResolvedValue(game)
        
        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('returns 404 if no game found with specified id', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 if no contest found with specified id', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
            .expect(404, { message: `Could not find contest with id '${contestId}'` })
            .end(done)
    })

    it('returns 404 if no contestant found with specified id', (done) => {
        repo.getById.mockResolvedValue(mockGameWithContests(gameId, [contestId]))

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
            .expect(404, { message: `Unable to find contestant with player id '${playerId}'` })
            .end(done)
    })
})

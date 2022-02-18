import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithContests, mockGameWithContestsAndPlayers } from '../mock/game'
import { mockContestant } from '../mock/contestant'

describe('DELETE /api/games/:gameId/contests/:contestId/contestants/:contestantId', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const contestId = 'abcabcabcabcabcabcabc'
    const playerId1 = '123123123123123123123'
    const playerId2 = '321321321312321321321'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('deletes contestant with specified id', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId1, playerId2])
        game.contests[contestId]!.contestants[playerId2] = mockContestant(playerId2)

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId2)}`)
            .expect(200, {})
            .expect(() => {
                expect(repo.deleteNested).toHaveBeenCalledWith(gameId, `contests.${contestId}.contestants.${playerId2}`)
            })
            .end(done)
    })

    it('sends notification of deleted contestant via web socket', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId1, playerId2])
        game.contests[contestId]!.contestants[playerId2] = mockContestant(playerId2)

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId2)}`)
            .expect(() => {
                expect(socket.send).toHaveBeenCalledWith(
                    'contestants.remove',
                    { params: { gameId, contestId, playerId: playerId2 } }
                )
            })
            .end(done)
    })

    it('returns 404 error if game with specified id not found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId2)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 error if contest with specified id not found', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId2)}`)
            .expect(404, { message: `Could not find contest with id '${contestId}'` })
            .end(done)
    })

    it('returns 404 error if contestant with specified id not found', (done) => {
        repo.getById.mockResolvedValue(mockGameWithContests(gameId, [contestId]))

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId2)}`)
            .expect(404, { message: `Unable to find contestant with player id '${playerId2}'` })
            .end(done)
    })

    it('returns 400 error if invalid game id specified', (done) => {
        request(app)
            .delete(`/api/games/invalid/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId2)}`)
            .expect(400, {
                message: [
                    '"game id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 400 error if invalid contest id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/invalid/contestants/${encodeURI(playerId2)}`)
            .expect(400, {
                message: [
                    '"contest id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 400 error if invalid contest id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/invalid`)
            .expect(400, {
                message: [
                    '"player id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 500 error if contestant fails to delete', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId1, playerId2])
        game.contests[contestId]!.contestants[playerId2] = mockContestant(playerId2)

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(false)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId2)}`)
            .expect(500, { message: 'Unexpectedly failed to delete data from database' })
            .end(done)
    })
})

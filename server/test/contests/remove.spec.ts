import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithContests } from '../mock/game'

describe('DELETE /api/games/:gameId/contests/:contestId', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const contestId1 = '123123123123123123123'
    const contestId2 = '321321321312321321321'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('deletes contest with specified id', (done) => {
        const game = mockGameWithContests(gameId, [contestId1, contestId2])

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId2)}`)
            .expect(200, {})
            .expect(() => {
                expect(repo.deleteNested).toHaveBeenCalledWith(gameId, `contests.${contestId2}`)
            })
            .end(done)
    })

    it('sends notification of deleted contest via web socket', (done) => {
        const game = mockGameWithContests(gameId, [contestId1, contestId2])

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId2)}`)
            .expect(() => {
                expect(socket.send).toHaveBeenCalledWith(
                    'contests.remove',
                    { params: { gameId, contestId: contestId2 } }
                )
            })
            .end(done)
    })

    it('returns 404 error if game with specified id not found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId2)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 error if contest with specified id not found', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId2)}`)
            .expect(404, { message: `Could not find contest with id '${contestId2}'` })
            .end(done)
    })

    it('returns 400 error if invalid game id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI('invalid')}/contests/${encodeURI(contestId2)}`)
            .expect(400, {
                message: [
                    '"game id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 400 error if invalid contest id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI('invalid')}`)
            .expect(400, {
                message: [
                    '"contest id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 500 error if contest fails to delete', (done) => {
        const expected = mockGameWithContests(gameId, [contestId1, contestId2])

        repo.getById.mockResolvedValue(expected)
        repo.deleteNested.mockResolvedValue(false)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId1)}`)
            .expect(500, { message: 'Unexpectedly failed to delete data from database' })
            .end(done)
    })
})

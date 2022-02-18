import { mockRepo, MockRepository } from '../mock/repo'
import { mockGenerateId } from '../mock/generateId'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGame, mockGameWithContests } from '../mock/game'
import { mockContest } from '../mock/contest'
import { removeOptional } from '../removeOptional'
import request from 'supertest'
import app from '../../src/server'

describe('POST /api/games/:gameId/contests', () => {
    let repo: MockRepository
    let generateId: jest.SpyInstance<string, []>
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const contestId = '123123123123123123123'

    beforeEach(() => {
        repo = mockRepo()
        generateId = mockGenerateId()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns a new contest', (done) => {
        const game = mockGame(gameId)
        const expected = mockContest(contestId, 1)

        generateId.mockReturnValue(contestId)
        const body = {}

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests`)
            .send(body)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}`, expected)
            })
            .end(done)
    })

    it('returns a new contest with next available sort', (done) => {
        const existingContestIds = [contestId, '111222333444555666777']
        const game = mockGameWithContests(gameId, existingContestIds)
        const expected = mockContest(contestId, existingContestIds.length + 1)

        generateId.mockReturnValue(contestId)
        const body = {}

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests`)
            .send(body)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}`, expected)
            })
            .end(done)
    })

    it('sends the new contest via web socket', (done) => {
        const game = mockGame(gameId)
        const expected = mockContest(contestId, 1)

        generateId.mockReturnValue(contestId)
        const body = {}

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests`)
            .send(body)
            .expect(() => {
                expect(socket.send).toHaveBeenCalledWith('contests.add', { params: { gameId }, value: expected })
            })
            .end(done)
    })

    it('returns 500 error if contest fails to persist', (done) => {
        const game = mockGame(gameId)

        generateId.mockReturnValue(contestId)
        const body = {}

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    })

    it('returns 404 if no game found with specified id', (done) => {
        const body = {}

        repo.getById.mockResolvedValue(undefined)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests`)
            .send(body)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })
})

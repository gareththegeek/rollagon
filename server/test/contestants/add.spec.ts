import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGame, mockGameWithContests, mockGameWithContestsAndPlayers } from '../mock/game'
import { mockContestant } from '../mock/contestant'
import { removeOptional } from '../removeOptional'
import request from 'supertest'
import app from '../../src/server'

describe('POST /api/games/:gameId/contests/:contestId/contestants', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const contestId = '123123123123123123123'
    const playerId = 'abcabcabcabcabcabcabc'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.resetModules()
    })

    it('returns a new contestant with specified player id', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        const expected = mockContestant(playerId)

        const body = { playerId }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}.contestants.${playerId}`, expected)
            })
            .end(done)
    })

    it('sends the new contestant via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)
        
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        const expected = mockContestant(playerId)

        const body = { playerId }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
                expect(room.emit).toHaveBeenCalledWith('contestants.add', { params: { gameId, contestId }, value: expected })
            })
            .end(done)
    })

    it('returns 500 error if contestant fails to persist', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])

        const body = { playerId }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    })

    it('returns 400 if no player id specified', (done) => {
        const body = {}

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(400, { message: ['"player id" is required'] })
            .end(done)
    })

    it('returns 404 if no game found with specified id', (done) => {
        const body = { playerId }

        repo.getById.mockResolvedValue(undefined)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 if no contest found with specified id', (done) => {
        const body = { playerId }

        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(404, { message: `Unable to find contest with id '${contestId}'` })
            .end(done)
    })

    it('returns 400 if no player found with specified id', (done) => {
        const body = { playerId }

        repo.getById.mockResolvedValue(mockGameWithContests(gameId, [contestId]))

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(400, { message: `No player with id '${playerId}' found in the current game` })
            .end(done)
    })

    it('returns 400 if player id is invalid', (done) => {
        const body = { playerId: 'invalid' }

        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants`)
            .send(body)
            .expect(400, { message: ['"player id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'] })
            .end(done)
    })
})

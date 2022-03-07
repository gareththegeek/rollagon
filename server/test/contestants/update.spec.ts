import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGameWithContestsAndPlayers } from '../mock/game'
import request from 'supertest'
import app from '../../src/server'
import { removeOptional } from '../removeOptional'
import { Contestant, DicePool } from '../../src/services/Game'
import { mockContestant } from '../mock/contestant'

describe('PUT /api/games/:gameId/contests/:contestId/contestants/:contestantId', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const contestId = '123123123123123123123'
    const playerId = '555555555555555555555'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
		jest.resetModules()
    })

    const buildContestantRecord = (playerId: string): Contestant => ({
        playerId,
        ready: false,
        prevail: undefined,
        dicePool: {
            score: undefined,
            rolled: false,
            dice: [
                { type: 'd4', roll: undefined },
                { type: 'd6', roll: undefined },
                { type: 'd8', roll: undefined },
                { type: 'd10', roll: undefined },
                { type: 'd12', roll: undefined }
            ]
        }
    })

    const buildContestantBody = (playerId: string): Partial<Contestant> => {
        const record = removeOptional(buildContestantRecord(playerId))
        const dicePool = record.dicePool as Partial<DicePool>
        delete dicePool.rolled
        delete record.playerId
        return record
    }

    it('updates specified contestant details', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        const existing = mockContestant(playerId)
        game.contests[contestId]!.contestants[playerId] = existing

        const expected = buildContestantRecord(playerId)
        const body = buildContestantBody(playerId)

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
            .send(body)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}.contestants.${playerId}`, expected)
            })
            .end(done)
    })

    it('sends the updated contestant via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)
        
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        const existing = mockContestant(playerId)
        game.contests[contestId]!.contestants[playerId] = existing

        const expected = buildContestantRecord(playerId)
        const body = buildContestantBody(playerId)

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
            .send(body)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
				expect(room.emit).toHaveBeenCalledWith('contestant.update', { params: { gameId, contestId, playerId }, value: expected })
            })
            .end(done)
    })

    it('returns 500 error if contestant fails to persist', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        const existing = mockContestant(playerId)
        game.contests[contestId]!.contestants[playerId] = existing

        const body = buildContestantBody(playerId)

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    });

    [{
        test: 'missing required properties',
        body: {},
        message: ['"ready" is required', '"dicePool" is required']
    }, {
        test: 'missing required dice properties',
        body: {
            ready: false,
            dicePool: { dice: [{}] }
        },
        message: ['"dicePool.dice[0].type" is required']
    }, {
        test: 'invalid dice type',
        body: {
            ready: false,
            dicePool: {
                dice: [{
                    type: 'd5'
                }]
            }
        },
        message: ['"dicePool.dice[0].type" must be one of [d4, d6, d8, d10, d12]']
    }].forEach(({ test, body, message }) => {
        it(`returns 400 if ${test}`, (done) => {
            request(app)
                .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
                .send(body)
                .expect(400, { message })
                .end(done)
        })
    });

    [{
        dice: [{
            type: 'd6'
        }]
    }, {
        dice: [{
            type: 'd6'
        }, {
            type: 'd4'
        }]
    }].forEach(dicePool => {
        it(`returns 400 error if ready is true but dice are [${dicePool.dice.map(d => d.type).join(',')}]`, (done) => {
            const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
            const existing = mockContestant(playerId)
            game.contests[contestId]!.contestants[playerId] = existing

            const body = {
                ready: true,
                dicePool
            }

            repo.getById.mockResolvedValue(game)
            repo.updateNested.mockResolvedValue(true)

            request(app)
                .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}`)
                .send(body)
                .expect(400, { message: 'Cannot set ready unless at least two dice (d6-d12) are included in the dice pool' })
                .end(done)
        })
    })
})

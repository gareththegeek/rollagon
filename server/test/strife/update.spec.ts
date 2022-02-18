import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGame } from '../mock/game'
import { mockContest } from '../mock/contest'
import request from 'supertest'
import app from '../../src/server'
import { removeOptional } from '../removeOptional'
import { ContestStatusType, DicePool } from '../../src/services/Game'

describe('PUT /api/games/:gameId/contests/:contestId/strife', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = "1234567890ABCDEfghijk"
    const contestId = "123123123123123123123"

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    const buildStrifeRecord = () => ({
        strifeLevel: 7,
        harmTags: ['sacred', 'perilous', 'mythic', 'epic'],
        targetNumber: undefined,
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

    const buildStrifeBody = () => {
        const record = removeOptional(buildStrifeRecord())
        const dicePool = record.dicePool as Partial<DicePool>
        delete dicePool.rolled
        return record
    }

    it('updates specified contest details', (done) => {
        const game = mockGame(gameId)
        const existing = mockContest(contestId, 1)
        game.contests[contestId] = existing

        const expected = buildStrifeRecord()
        const body = buildStrifeBody()

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
            .send(body)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}.strife`, expected)
            })
            .end(done)
    })

    it('sends the updated strife via web socket', (done) => {
        const game = mockGame(gameId)
        const existing = mockContest(contestId, 1)
        game.contests[contestId] = existing

        const expected = buildStrifeRecord()
        const body = buildStrifeBody()

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
            .send(body)
            .expect(() => {
                expect(socket.send).toHaveBeenCalledWith('strife.update', { params: { gameId, contestId }, value: expected })
            })
            .end(done)
    })

    it('returns 500 error if strife fails to persist', (done) => {
        const game = mockGame(gameId)
        const existing = mockContest(contestId, 1)
        game.contests[contestId] = existing

        const body = buildStrifeBody()

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    });

    [{
        test: 'missing required properties',
        body: {},
        message: ['"strifeLevel" is required', '"dicePool" is required']
    }, {
        test: 'invalid strife level',
        body: {
            strifeLevel: 'sausage',
            harmTags: [],
            dicePool: { dice: [] }
        },
        message: ['"strifeLevel" must be a number']
    }, {
        test: 'invalid harm tag',
        body: {
            strifeLevel: 4,
            harmTags: ['invalid'],
            dicePool: { dice: [] }
        },
        message: ['"harmTags[0]" must be one of [sacred, perilous, mythic, epic]']
    }, {
        test: 'duplicate harm tag',
        body: {
            strifeLevel: 4,
            harmTags: ['epic', 'epic'],
            dicePool: { dice: [] }
        },
        message: ['"harmTags[1]" contains a duplicate value']
    }, {
        test: 'missing required dice properties',
        body: {
            strifeLevel: 4,
            harmTags: [],
            dicePool: { dice: [{}] }
        },
        message: ['"dicePool.dice[0].type" is required']
    }, {
        test: 'invalid dice type',
        body: {
            strifeLevel: 4,
            harmTags: [],
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
                .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
                .send(body)
                .expect(400, { message })
                .end(done)
        })
    });

    ['targetSet', 'complete'].forEach(status => {
        it(`returns 400 error if contest status is '${status}'`, (done) => {
            const game = mockGame(gameId)
            const existing = mockContest(contestId, 1)
            game.contests[contestId] = existing
            existing.status = status as ContestStatusType

            const body = buildStrifeBody()

            repo.getById.mockResolvedValue(game)
            repo.updateNested.mockResolvedValue(true)

            request(app)
                .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/strife`)
                .send(body)
                .expect(400, { message: 'Cannot modify strife as target number has already been set' })
                .end(done)
        })
    })
})

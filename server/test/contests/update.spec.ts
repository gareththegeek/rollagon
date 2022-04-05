import { mockRepo, MockRepository } from '../mock/repo'
import { getRandom } from '../mock/getRandom'
import { mockSocket, MockServer, MockRoom } from '../mock/socket'
import { mockGameWithContests, mockGameWithContestsAndPlayers } from '../mock/game'
import request from 'supertest'
import app from '../../src/server'
import { Contest, ContestStatusType } from '../../src/services/Game'
import { removeOptional } from '../removeOptional'

describe('PUT /api/games/:gameId/contests/:contestId', () => {
    let repo: MockRepository
    //let getRandom: jest.SpyInstance<number, []>
    let socket: MockServer
    let room: MockRoom

    const gameId = '1234567890ABCDEfghijk'
    const contestId = '123123123123123123123'
    const playerId1 = '111111111111111111111'
    const playerId2 = '222222222222222222222'
    const playerId3 = '333333333333333333333'
    const timestamp = '2022-01-01T00:00:01.000Z'
    const newerTimestamp = '2022-01-01T00:00:02.000Z'

    beforeEach(() => {
        repo = mockRepo()
        //getRandom = mockGetRandom()
        socket = mockSocket()
        room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)
    })

    afterEach(() => {
        jest.resetModules()
        jest.resetAllMocks()
    })

    const roll = (value: number, max: number): number => (value - 1) / max

    it('rolls strife and calculates target number when transitioning from new to targetSet', (done) => {
        const d6 = 3
        const d8 = 5
        const strifeLevel = 4

        const rolls = [roll(d6, 6), roll(d8, 8)]
        rolls.forEach(roll => getRandom.mockReturnValueOnce(roll))

        const game = mockGameWithContests(gameId, [contestId])

        const contest = game.contests[contestId]!
        contest.status = 'new'
        contest.strife = {
            strifeLevel,
            targetNumber: undefined,
            harmTags: [],
            dicePool: {
                rolled: false,
                score: undefined,
                dice: [{
                    type: 'd6',
                    roll: undefined
                }, {
                    type: 'd8',
                    roll: undefined
                }]
            }
        }

        const expected: Contest = {
            timestamp,
            status: 'targetSet',
            id: contest.id,
            sort: contest.sort,
            strife: {
                strifeLevel,
                targetNumber: d8 + strifeLevel,
                harmTags: [],
                dicePool: {
                    rolled: true,
                    score: d8,
                    dice: [{
                        type: 'd8',
                        roll: d8
                    }, {
                        type: 'd6',
                        roll: d6
                    }]
                }
            },
            contestants: {}
        }

        const body = { status: 'targetSet', timestamp }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}`)
            .send(body)
            .expect(200, expected)
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}`, expected)
                expect(socket.to).toHaveBeenCalledWith(gameId)
                expect(room.emit).toHaveBeenCalledWith('contest.update', { params: { gameId, contestId }, value: expected })
            })
            .end(done)
    })

    it('does not update contest if timestamp is older than database timestamp', (done) => {
        const game = mockGameWithContests(gameId, [contestId])

        const existing = game.contests[contestId]!
        existing.timestamp = newerTimestamp
        existing.status = 'new'
        existing.strife = {
            strifeLevel: 4,
            targetNumber: undefined,
            harmTags: [],
            dicePool: {
                rolled: false,
                score: undefined,
                dice: [{
                    type: 'd6',
                    roll: undefined
                }]
            }
        }

        const body = { status: 'targetSet', timestamp }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}`)
            .send(body)
            .expect(200, removeOptional(existing))
            .expect(() => {
                expect(repo.updateNested).not.toHaveBeenCalledWith(gameId, `contests.${contestId}`, expect.any(Object))
            })
            .end(done)
    })

    it('returns 400 when transitioning from new to targetSet with no dice', (done) => {
        const game = mockGameWithContests(gameId, [contestId])

        const contest = game.contests[contestId]!
        contest.status = 'new'
        contest.strife = {
            strifeLevel: 4,
            targetNumber: undefined,
            harmTags: [],
            dicePool: {
                rolled: false,
                score: undefined,
                dice: []
            }
        }

        const body = { status: 'targetSet', timestamp }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}`)
            .send(body)
            .expect(400, { message: 'Setting the contest target number requires at least one dice' })
            .end(done)
    })

    it('rolls contest and calculates contestants scores when transitioning from targetSet to complete', (done) => {
        const d6a = 2
        const d6b = 3
        const d4a = 3

        const d6c = 6
        const d10a = 4
        const d6d = 3

        const d8a = 3
        const d8b = 2
        const d4b = 1
        const d4c = 2

        const rolls = [
            roll(d6a, 6), roll(d6b, 6), roll(d4a, 4), // player 1
            roll(d6c, 6), roll(d6d, 6), roll(d10a, 10), // player 2
            roll(d8a, 8), roll(d4b, 4), roll(d8b, 8), roll(d4c, 4) // player 3
        ]
        rolls.forEach(roll => getRandom.mockReturnValueOnce(roll))

        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId1, playerId2, playerId3])

        const contest = game.contests[contestId]!
        contest.status = 'targetSet'
        contest.strife = {
            strifeLevel: 4,
            targetNumber: 8,
            harmTags: [],
            dicePool: {
                rolled: true,
                score: 4,
                dice: [{
                    type: 'd8',
                    roll: 4
                }, {
                    type: 'd6',
                    roll: 3
                }]
            }
        }
        contest.contestants = {
            playerId1: {
                playerId: playerId1,
                prevail: undefined,
                ready: true,
                dicePool: {
                    rolled: false,
                    score: undefined,
                    dice: [
                        { type: 'd6', roll: undefined },
                        { type: 'd6', roll: undefined },
                        { type: 'd4', roll: undefined }
                    ]
                }
            },
            playerId2: {
                playerId: playerId2,
                prevail: undefined,
                ready: true,
                dicePool: {
                    rolled: false,
                    score: undefined,
                    dice: [
                        { type: 'd6', roll: undefined },
                        { type: 'd6', roll: undefined },
                        { type: 'd10', roll: undefined }
                    ]
                }
            },
            playerId3: {
                playerId: playerId3,
                prevail: undefined,
                ready: true,
                dicePool: {
                    rolled: false,
                    score: undefined,
                    dice: [
                        { type: 'd8', roll: undefined },
                        { type: 'd4', roll: undefined },
                        { type: 'd8', roll: undefined },
                        { type: 'd4', roll: undefined }
                    ]
                }
            }
        }

        const expected: Contest = {
            timestamp,
            status: 'complete',
            id: contest.id,
            sort: contest.sort,
            strife: contest.strife,
            contestants: {
                [playerId1]: {
                    playerId: playerId1,
                    prevail: true,
                    ready: true,
                    dicePool: {
                        rolled: true,
                        score: 8,
                        dice: [
                            { type: 'd6', roll: d6b },
                            { type: 'd6', roll: d6a },
                            { type: 'd4', roll: d4a }
                        ]
                    }
                },
                [playerId2]: {
                    playerId: playerId2,
                    prevail: true,
                    ready: true,
                    dicePool: {
                        rolled: true,
                        score: 10,
                        dice: [
                            { type: 'd6', roll: d6c },
                            { type: 'd10', roll: d10a },
                            { type: 'd6', roll: d6d }
                        ]
                    }
                },
                [playerId3]: {
                    playerId: playerId3,
                    prevail: false,
                    ready: true,
                    dicePool: {
                        rolled: true,
                        score: 7,
                        dice: [
                            { type: 'd8', roll: d8a },
                            { type: 'd8', roll: d8b },
                            { type: 'd4', roll: d4c },
                            { type: 'd4', roll: d4b }
                        ]
                    }
                }
            }
        }

        const body = { status: 'complete', timestamp }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}`)
            .send(body)
            .expect(200, expected)
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}`, expected)
                expect(socket.to).toHaveBeenCalledWith(gameId)
                expect(room.emit).toHaveBeenCalledWith('contest.update', { params: { gameId, contestId }, value: expected })
            })
            .end(done)
    })

    it('returns 400 error if a contestant is not ready when transitioning from targetSet to complete', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId1, playerId2])

        const contest = game.contests[contestId]!
        contest.status = 'targetSet'

        contest.contestants = {
            playerId1: {
                playerId: playerId1,
                prevail: undefined,
                ready: true,
                dicePool: {
                    rolled: false,
                    score: undefined,
                    dice: [
                        { type: 'd6', roll: undefined },
                        { type: 'd6', roll: undefined }
                    ]
                }
            },
            playerId2: {
                playerId: playerId2,
                prevail: undefined,
                ready: false,
                dicePool: {
                    rolled: false,
                    score: undefined,
                    dice: [
                        { type: 'd6', roll: undefined },
                        { type: 'd6', roll: undefined }
                    ]
                }
            }
        }

        const body = { status: 'complete', timestamp }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}`)
            .send(body)
            .expect(400, { message: 'All players must be ready before contest can be rolled' })
            .end(done)
    })

    it('returns 500 error if contest fails to persist', (done) => {
        const game = mockGameWithContests(gameId, [contestId])

        const contest = game.contests[contestId]!
        contest.status = 'new'
        contest.strife = {
            strifeLevel: 4,
            targetNumber: undefined,
            harmTags: [],
            dicePool: {
                rolled: false,
                score: undefined,
                dice: [{
                    type: 'd10',
                    roll: undefined
                }]
            }
        }

        const body = { status: 'targetSet', timestamp }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    });

    [
        { from: 'new', to: 'new' },
        { from: 'targetSet', to: 'targetSet' },
        { from: 'targetSet', to: 'new' },
        { from: 'new', to: 'complete' },
        { from: 'complete', to: 'complete' },
        { from: 'complete', to: 'targetSet' }
    ].forEach(({ from, to }) => {
        it(`returns 400 if transition from '${from}' to '${to}' is requested`, (done) => {
            const game = mockGameWithContests(gameId, [contestId])
            game.contests[contestId]!.status = from as ContestStatusType

            const body = { status: to, timestamp }

            repo.getById.mockResolvedValue(game)

            request(app)
                .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}`)
                .send(body)
                .expect(400, { message: `Cannot change contest state from '${from}' to '${to}'` })
                .end(done)
        })
    })
})

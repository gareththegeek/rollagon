import { getRandom } from '../mock/getRandom'
import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGameWithContestsAndPlayers } from '../mock/game'
import request from 'supertest'
import app from '../../src/server'
import { mockContestant } from '../mock/contestant'
import { removeOptional } from '../removeOptional'

describe('PUT /api/games/:gameId/contests/:contestId/contestants/:contestantId/nameDie', () => {
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

    it('rolls the name dice specified', (done) => {
        const roll = 3
        const d6max = 6
        getRandom.mockReturnValue((roll - 1) / d6max)

        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        game.contests[contestId]!.status = 'complete'
        const contestant = mockContestant(playerId)
        game.contests[contestId]!.contestants[playerId] = contestant

        const body = {
            type: 'd6'
        }
        const expected = {
            ...contestant,
            dicePool: {
                ...contestant?.dicePool,
                nameDie: {
                    type: 'd6',
                    roll
                }
            }
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}/nameDie`)
            .send(body)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `contests.${contestId}.contestants.${playerId}.dicePool.nameDie`, expected.dicePool.nameDie)
            })
            .end(done)
    })

    it('returns 400 error if name dice is specified before contest has been resolved', (done) => {
        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        const existing = mockContestant(playerId)
        game.contests[contestId]!.status = 'targetSet'
        game.contests[contestId]!.contestants[playerId] = existing

        const body = {
            type: 'd6'
        }

        repo.getById.mockResolvedValue(game)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}/nameDie`)
            .send(body)
            .expect(400, { message: 'Cannot roll name die until contest has been resolved' })
            .expect(() => {
                expect(repo.updateNested).not.toHaveBeenCalled()
            })
            .end(done)
    })

    it('sends the updated contestant via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)

        const roll = 3
        const d6max = 6
        getRandom.mockReturnValue((roll - 1) / d6max)

        const game = mockGameWithContestsAndPlayers(gameId, [contestId], [playerId])
        game.contests[contestId]!.status = 'complete'
        const contestant = mockContestant(playerId)
        game.contests[contestId]!.contestants[playerId] = contestant

        const body = {
            type: 'd6'
        }
        const expected = {
            ...contestant,
            dicePool: {
                ...contestant?.dicePool,
                nameDie: {
                    type: 'd6',
                    roll
                }
            }
        }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/contests/${encodeURI(contestId)}/contestants/${encodeURI(playerId)}/nameDie`)
            .send(body)
            .expect(200)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
                expect(room.emit).toHaveBeenCalledWith('nameDie.update', { params: { gameId, contestId, playerId }, value: expected })
            })
            .end(done)
    })
})

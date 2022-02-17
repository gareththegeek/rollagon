import { mockRepo, MockRepository } from '../mock/repo'
import { nanoid } from 'nanoid'
import request from 'supertest'
import app from '../../src/server'
import { mockGame } from '../mock/game'

describe('GET /api/games/:gameId', () => {
    let repo: MockRepository

    const gameId = nanoid()

    beforeEach(() => {
        repo = mockRepo()
    })

    it('returns game with specified id', (done) => {
        const expected = mockGame(gameId)

        repo.getById.mockResolvedValue(expected)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}`)
            .expect(200, expected)
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })
})

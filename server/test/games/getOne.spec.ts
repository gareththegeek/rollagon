import { mockRepo, MockRepository } from '../mock/repo'
import request from 'supertest'
import app from '../../src/server'
import { mockGame } from '../mock/game'

describe('GET /api/games/:gameId', () => {
    let repo: MockRepository

    const gameId = '1234567890ABCDEfghijk'

    beforeEach(() => {
        repo = mockRepo()
    })

    afterEach(() => {
        jest.resetAllMocks()
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

    it('returns 404 if no game with specified id found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })
})

import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import request from 'supertest'
import app from '../../src/server'
import { mockGame } from '../mock/game'

describe('DELETE /api/games/:gameId', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
		jest.resetModules()
    })

    it('deletes game with specified id', (done) => {
        const expected = mockGame(gameId)

        repo.getById.mockResolvedValue(expected)
        repo.delete.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${gameId}`)
            .expect(200, {})
            .expect(() => {
                expect(repo.delete).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('sends notification of deleted game via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)
        
        const expected = mockGame(gameId)

        repo.getById.mockResolvedValue(expected)
        repo.delete.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${gameId}`)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
				expect(room.emit).toHaveBeenCalledWith('games.remove', { params: { gameId } })
            })
            .end(done)
    })

    it('returns 404 error if game with specified id not found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .delete(`/api/games/${gameId}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 400 error if invalid game id specified', (done) => {
        request(app)
            .delete(`/api/games/invalid`)
            .expect(400, { message: [
                '"game id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
            ] })
            .end(done)
    })

    it('returns 500 error if game fails to delete', (done) => {
        const expected = mockGame(gameId)

        repo.getById.mockResolvedValue(expected)
        repo.delete.mockResolvedValue(false)

        request(app)
            .delete(`/api/games/${gameId}`)
            .expect(500, { message: 'Unexpectedly failed to delete data from database' })
            .end(done)
    })
})

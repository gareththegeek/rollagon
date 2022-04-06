import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer } from '../mock/socket'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithNotes } from '../mock/game'

describe('DELETE /api/games/:gameId/notes/:noteId', () => {
    let repo: MockRepository
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const noteId1 = '123123123123123123123'
    const noteId2 = '321321321312321321321'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
		jest.resetModules()
    })

    it('deletes note with specified id', (done) => {
        const game = mockGameWithNotes(gameId, [noteId1, noteId2])

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId2)}`)
            .expect(200, {})
            .expect(() => {
                expect(repo.deleteNested).toHaveBeenCalledWith(gameId, `notes.${noteId2}`)
            })
            .end(done)
    })

    it('sends notification of deleted note via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)
        
        const game = mockGameWithNotes(gameId, [noteId1, noteId2])

        repo.getById.mockResolvedValue(game)
        repo.deleteNested.mockResolvedValue(true)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId2)}`)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
				expect(room.emit).toHaveBeenCalledWith(
                    'note.remove',
                    { params: { gameId, noteId: noteId2 } }
                )
            })
            .end(done)
    })

    it('returns 404 error if game with specified id not found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId2)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 error if note with specified id not found', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId2)}`)
            .expect(404, { message: `Could not find note with id '${noteId2}'` })
            .end(done)
    })

    it('returns 400 error if invalid game id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI('invalid')}/notes/${encodeURI(noteId2)}`)
            .expect(400, {
                message: [
                    '"game id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 400 error if invalid note id specified', (done) => {
        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/notes/${encodeURI('invalid')}`)
            .expect(400, {
                message: [
                    '"note id" with value "invalid" fails to match the required pattern: /^[A-Za-z0-9_-]{21}$/'
                ]
            })
            .end(done)
    })

    it('returns 500 error if note fails to delete', (done) => {
        const expected = mockGameWithNotes(gameId, [noteId1, noteId2])

        repo.getById.mockResolvedValue(expected)
        repo.deleteNested.mockResolvedValue(false)

        request(app)
            .delete(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId1)}`)
            .expect(500, { message: 'Unexpectedly failed to delete data from database' })
            .end(done)
    })
})

import { mockRepo, MockRepository } from '../mock/repo'
import { mockSocket, MockServer, MockRoom } from '../mock/socket'
import { mockGameWithNotes } from '../mock/game'
import request from 'supertest'
import app from '../../src/server'
import { removeOptional } from '../removeOptional'

describe('PUT /api/games/:gameId/notes/:noteId', () => {
    let repo: MockRepository
    let socket: MockServer
    let room: MockRoom

    const gameId = '1234567890ABCDEfghijk'
    const noteId = '123123123123123123123'
    const timestamp = '2022-01-01T00:00:01.000Z'
    const newerTimestamp = '2022-01-01T00:00:02.000Z'

    beforeEach(() => {
        repo = mockRepo()
        socket = mockSocket()
        room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)
    })

    afterEach(() => {
        jest.resetModules()
        jest.resetAllMocks()
    })

    it('does not update note if timestamp is older than database timestamp', (done) => {
        const game = mockGameWithNotes(gameId, [noteId])

        const existing = game.notes[noteId]!
        existing.timestamp = newerTimestamp

        const body = { timestamp, text: 'updated text' }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId)}`)
            .send(body)
            .expect(200, removeOptional(existing))
            .expect(() => {
                expect(repo.updateNested).not.toHaveBeenCalledWith(gameId, `notes.${noteId}`, expect.any(Object))
            })
            .end(done)
    })

    it('returns 500 error if note fails to persist', (done) => {
        const game = mockGameWithNotes(gameId, [noteId])

        const body = { timestamp, text: 'new text' }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .put(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId)}`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    })
})

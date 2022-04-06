import { mockRepo, MockRepository } from '../mock/repo'
import { mockGenerateId } from '../mock/generateId'
import { mockSocket, MockServer } from '../mock/socket'
import { mockGame } from '../mock/game'
import { removeOptional } from '../removeOptional'
import request from 'supertest'
import app from '../../src/server'
import { mockNote } from '../mock/notes'

describe('POST /api/games/:gameId/notes', () => {
    let repo: MockRepository
    let generateId: jest.SpyInstance<string, []>
    let socket: MockServer

    const gameId = '1234567890ABCDEfghijk'
    const noteId = '123123123123123123123'
    const timestamp = '2022-01-01T00:00:01.000Z'

    beforeEach(() => {
        repo = mockRepo()
        generateId = mockGenerateId()
        socket = mockSocket()
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.resetModules()
    })

    it('returns a new note', (done) => {
        const game = mockGame(gameId)
        const expected = mockNote(noteId)
        expected.timestamp = timestamp

        generateId.mockReturnValue(noteId)
        const { id, ...body } = expected

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/notes`)
            .send(body)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.updateNested).toHaveBeenCalledWith(gameId, `notes.${noteId}`, expected)
            })
            .end(done)
    })

    it('sends the new note via web socket', (done) => {
        const room = { emit: jest.fn() }
        socket.to.mockReturnValue(room)

        const game = mockGame(gameId)
        const expected = mockNote(noteId)
        expected.timestamp = timestamp

        generateId.mockReturnValue(noteId)
        const { id, ...body } = expected

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/notes`)
            .send(body)
            .expect(() => {
                expect(socket.to).toHaveBeenCalledWith(gameId)
                expect(room.emit).toHaveBeenCalledWith('note.add', { params: { gameId }, value: expected })
            })
            .end(done)
    })

    it('returns 500 error if note fails to persist', (done) => {
        const game = mockGame(gameId)

        generateId.mockReturnValue(noteId)
        const body = { timestamp, text: 'test' }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(false)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/notes`)
            .send(body)
            .expect(500, { message: 'Unexpectedly failed to persist data to database' })
            .end(done)
    })

    it('returns 404 if no game found with specified id', (done) => {
        const body = { timestamp, text: 'test' }

        repo.getById.mockResolvedValue(undefined)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/notes`)
            .send(body)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 400 error if no text specified', (done) => {
        const game = mockGame(gameId)

        generateId.mockReturnValue(noteId)
        const body = { timestamp }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/notes`)
            .send(body)
            .expect(400, { message: ['"text" is required'] })
            .expect(() => {
                expect(repo.updateNested).not.toHaveBeenCalled()
            })
            .end(done)
    })

    it('returns 400 error if text too long', (done) => {
        const game = mockGame(gameId)

        generateId.mockReturnValue(noteId)
        const body = { timestamp, text: 'a'.repeat(4097) }

        repo.getById.mockResolvedValue(game)
        repo.updateNested.mockResolvedValue(true)

        request(app)
            .post(`/api/games/${encodeURI(gameId)}/notes`)
            .send(body)
            .expect(400, { message: ['"text" length must be less than or equal to 512 characters long'] })
            .expect(() => {
                expect(repo.updateNested).not.toHaveBeenCalled()
            })
            .end(done)
    })
})

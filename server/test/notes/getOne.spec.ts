import { mockRepo, MockRepository } from '../mock/repo'
import { removeOptional } from '../removeOptional'
import request from 'supertest'
import app from '../../src/server'
import { mockGame, mockGameWithNotes } from '../mock/game'

describe('GET /api/games/:gameId/notes/:noteId', () => {
    let repo: MockRepository

    const gameId = '1234567890ABCDEfghijk'
    const noteId1 = '111111111111111111111'
    const noteId2 = '222222222222222222222'

    beforeEach(() => {
        repo = mockRepo()
    })

    afterEach(() => {
        jest.resetAllMocks()
		jest.resetModules()
    })

    it('returns note with specified id from specified game', (done) => {
        const game = mockGameWithNotes(gameId, [noteId1, noteId2])
        const expected = game.notes[noteId2]!

        repo.getById.mockResolvedValue(game)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId2)}`)
            .expect(200, removeOptional(expected))
            .expect(() => {
                expect(repo.getById).toHaveBeenCalledWith(gameId)
            })
            .end(done)
    })

    it('returns 404 if no game with specified id found', (done) => {
        repo.getById.mockResolvedValue(undefined)

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId2)}`)
            .expect(404, { message: `Could not find game with id '${gameId}'` })
            .end(done)
    })

    it('returns 404 if no note with specified id found', (done) => {
        repo.getById.mockResolvedValue(mockGame(gameId))

        request(app)
            .get(`/api/games/${encodeURI(gameId)}/notes/${encodeURI(noteId2)}`)
            .expect(404, { message: `Could not find note with id '${noteId2}'` })
            .end(done)
    })
})

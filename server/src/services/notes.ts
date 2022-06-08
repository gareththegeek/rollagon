import { generateId } from '../factories/generateId'
import { getRepository } from '../repository/factory'
import { Note } from './Game'
import { isError, Result } from './Result'
import * as gameService from './games'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetManyParams {
    gameId: string
}

interface GetOneParams extends GetManyParams {
    noteId: string
}

interface NoteBody {
    timestamp?: string | undefined
    text: string
}

export const getOne = async ({ gameId, noteId }: GetOneParams): Promise<Result<Note>> => {
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }

    const { value: game } = gameQuery
    const note = game!.notes[noteId]
    if (note === undefined || note === null) {
        return {
            status: 404,
            value: { message: `Could not find note with id '${noteId}'` }
        }
    }

    return {
        status: 200,
        value: note
    }
}

export const getMany = async ({ gameId }: GetManyParams): Promise<Result<Note[]>> => {
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }

    return {
        status: 200,
        value: Object.values(gameQuery.value.notes).filter(x => x !== null)
    }
}

export const add = async ({ gameId }: GetManyParams, { timestamp, text }: NoteBody): Promise<Result<Note>> => {
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }

    const note: Note = {
        timestamp,
        id: generateId(),
        text
    }

    const noteId = note.id
    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(gameId, `notes.${noteId}`, note)

    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data to database' }
        }
    }

    return {
        status: 200,
        value: note
    }
}

export const update = async (params: GetOneParams, body: NoteBody): Promise<Result<Note>> => {
    const noteQuery = await getOne(params)
    if (isError(noteQuery)) {
        return noteQuery
    }

    const { value: existing } = noteQuery

    if (body.timestamp! < existing.timestamp!) {
        return {
            status: 200,
            value: existing
        }
    }

    const next = {
        ...existing,
        ...body
    }

    const { gameId, noteId } = params
    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(
        gameId,
        `notes.${noteId}`,
        next)

    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data to database' }
        }
    }

    return {
        status: 200,
        value: next
    }
}

export const remove = async ({ gameId, noteId }: GetOneParams): Promise<Result<{}>> => {
    const noteQuery = await getOne({ gameId, noteId })
    if (isError(noteQuery)) {
        return noteQuery
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.deleteNested(gameId, `notes.${noteId}`)
    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to delete data from database' }
        }
    }

    return {
        status: 200,
        value: {}
    }
}

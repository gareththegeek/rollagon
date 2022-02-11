import moment from 'moment'
import { nanoid } from 'nanoid'
import { getRepository } from '../repository/factory'
import { Game } from './Game'
import { isError, Result } from './Result'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetOneParams {
    gameId: string
}

export const getOne = async ({ gameId }: GetOneParams): Promise<Result<Game>> => {
    const repo = getRepository(GAME_COLLECTION_NAME)

    const game = await repo.getById<Game>(gameId)

    if (game === undefined || game === null) {
        return {
            status: 404,
            value: { message: `Could not find game with id '${gameId}'` }
        }
    }

    return {
        status: 200,
        value: game
    }
}

export const add = async (_: unknown, game: Partial<Game>): Promise<Result<Game>> => {
    const valid = {
        ...game,
        id: nanoid(),
        createdOn: moment().utc().toISOString(),
        contests: [],
        players: []
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const gameId = await repo.insert(valid)

    if (gameId === undefined || gameId === null) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data into database' }
        }
    }

    const result = await getOne({ gameId })
    if (isError(result)) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to retrieve persisted data from database' }
        }
    }

    return result
}

export const remove = async ({ gameId }: GetOneParams): Promise<Result<{}>> => {
    const existing = await getOne({ gameId })
    if (isError(existing)) {
        return existing
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    await repo.delete(gameId)

    const result = await getOne({ gameId })
    if (isError(result)) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to delete data from database' }
        }
    }

    return result
}

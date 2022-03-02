import { getTimestamp } from '../factories/getTimestamp'
import { generateId } from '../factories/generateId'
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

    const { _id, ...noId } = game

    return {
        status: 200,
        value: noId
    }
}

export const add = async (): Promise<Result<Game>> => {
    const valid: Game = {
        id: generateId(),
        createdOn: getTimestamp(),
        contests: {},
        players: {}
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const dbId = await repo.insert(valid)
    if (dbId === undefined || dbId === null) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data into database' }
        }
    }

    return {
        status: 200,
        value: valid
    }
}

export const remove = async ({ gameId }: GetOneParams): Promise<Result<{}>> => {
    const existing = await getOne({ gameId })
    if (isError(existing)) {
        return existing
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.delete(gameId)
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

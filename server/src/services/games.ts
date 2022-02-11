import moment from 'moment'
import { nanoid } from 'nanoid'
import { getRepository } from '../repository/factory'
import { Game } from './Game'
import { Result } from './Result'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

export const getOne = async (id: string): Promise<Result<Game>> => {
    const repo = getRepository(GAME_COLLECTION_NAME)

    const game = await repo.getById<Game>(id)

    if (game === undefined || game === null) {
        return {
            status: 404,
            value: { message: `Could not find game with id '${id}'` }
        }
    }

    return {
        status: 200,
        value: game
    }
}

export const add = async (game: Partial<Game>): Promise<Result<Game>> => {
    const valid = {
        ...game,
        id: nanoid(),
        createdOn: moment().utc().toISOString(),
        contests: [],
        players: []
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const id = await repo.insert(valid)

    if (id === undefined || id === null) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data into database' }
        }
    }

    const { status, value } = await getOne(id)
    if (status !== 200) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to retrieve persisted data from database' }
        }
    }

    return {
        status: 200,
        value
    }
}

export const remove = async (id: string): Promise<Result<{}>> => {
    const existing = await getOne(id)
    if (existing.status !== 200) {
        return existing
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    await repo.delete(id)

    const { status, value } = await getOne(id)
    if (status !== 200) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to delete data from database' }
        }
    }

    return {
        status: 200,
        value
    }
}

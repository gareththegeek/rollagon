import { nanoid } from 'nanoid'
import { getRepository } from '../repository/factory'
import { isError, Result } from './Result'
import * as gameService from './games'
import { Player } from './Game'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetManyParams {
    gameId: string
}

interface GetOneParams extends GetManyParams {
    playerId: string
}

interface AddBody {
    name: string
}

export const getOne = async ({ gameId, playerId }: GetOneParams): Promise<Result<Player>> => {
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }

    const { value: game } = gameQuery
    const player = game.players[playerId]

    if (player === undefined) {
        return {
            status: 404,
            value: { message: `Could not find a player with game id '${gameId}' and player id '${playerId}'` }
        }
    }

    return {
        status: 200,
        value: player
    }
}

export const getMany = async ({ gameId }: GetManyParams): Promise<Result<Player[]>> => {
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }

    return {
        status: 200,
        value: Object.values(gameQuery.value.players).filter(x => x !== null)
    }
}

export const add = async ({ gameId }: GetManyParams, { name }: AddBody): Promise<Result<Player>> => {
    const repo = getRepository(GAME_COLLECTION_NAME)
    const player: Player = {
        id: nanoid(),
        name
    }
    const result = await repo.updateNested(gameId, `players.${player.id}`, player)

    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to retrieve persisted data from database' }
        }
    }

    return {
        status: 200,
        value: player
    }
}

export const remove = async ({ gameId, playerId }: GetOneParams): Promise<Result<{}>> => {
    const existing = await getOne({ gameId, playerId })
    if (isError(existing)) {
        return existing
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = repo.deleteNested(gameId, `players.${playerId}`)
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

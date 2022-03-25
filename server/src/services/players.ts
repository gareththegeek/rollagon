import { generateId } from '../factories/generateId'
import { getRepository } from '../repository/factory'
import { isError, Result } from './Result'
import * as gameService from './games'
import { Player } from './Game'
import { Socket } from 'socket.io'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetManyParams {
    gameId: string
}

interface GetOneParams extends GetManyParams {
    playerId: string
}

interface AddBody {
    timestamp?: string | undefined
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

export const add = async ({ gameId }: GetManyParams, { name, timestamp }: AddBody): Promise<Result<Player>> => {
    const repo = getRepository(GAME_COLLECTION_NAME)
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }

    const player: Player = {
        id: generateId(),
        timestamp,
        name
    }
    const result = await repo.updateNested(gameId, `players.${player.id}`, player)

    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data to database' }
        }
    }

    return {
        status: 200,
        value: player
    }
}

export const update = async (params: GetOneParams, { name, timestamp }: AddBody): Promise<Result<Player>> => {
    const playerQuery = await getOne(params)
    if (isError(playerQuery)) {
        return playerQuery
    }

    if (timestamp! < playerQuery.value.timestamp!) {
        return {
            status: 200,
            value: playerQuery.value
        }
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const { id } = playerQuery.value
    const { gameId } = params
    const next = {
        timestamp,
        id,
        name
    }
    const result = await repo.updateNested(gameId, `players.${id}`, next)
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

export const remove = async ({ gameId, playerId }: GetOneParams): Promise<Result<{}>> => {
    const existing = await getOne({ gameId, playerId })
    if (isError(existing)) {
        return existing
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.deleteNested(gameId, `players.${playerId}`)
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

const players: Record<string, string[]> = {}

export const socketConnectionHandler = (socket: Socket) => {
    let currentGameId: string | undefined = undefined
    let currentPlayerId: string | undefined = undefined

    socket.on('players.join', async ({ gameId, playerId }: { gameId: string, playerId: string }) => {
        console.info(`Player joining ${gameId}`)
        await socket.join(gameId)

        currentGameId = gameId
        currentPlayerId = playerId

        const list = players[gameId] ?? []
        players[gameId] = [...list, playerId]
        socket.emit('connections.update', { value: players[gameId] })
        socket.to(gameId).emit('connections.update', { value: players[gameId] })
    })

    const removePlayer = () => {
        if (currentGameId === undefined) {
            return
        }
        if (currentPlayerId === undefined) {
            return
        }

        const list = players[currentGameId] ?? []
        list.splice(list.indexOf(currentPlayerId), 1)
        players[currentGameId] = [...list]
        socket.to(currentGameId).emit('connections.update', { value: players[currentGameId] })

        currentGameId = undefined
        currentPlayerId = undefined
    }

    socket.on('players.leave', ({ gameId }: { gameId: string }) => {
        console.info(`Player leaving ${gameId}`)
        socket.leave(gameId)

        removePlayer()
    })

    socket.on('disconnect', () => {
        console.info(`Player disconnected ${currentGameId}`)
        removePlayer()
    })
}

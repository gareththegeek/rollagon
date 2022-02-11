import { nanoid } from 'nanoid'
import { getRepository } from '../repository/factory'
import { Contest, Game } from './Game'
import { isError, Result } from './Result'
import * as gameService from './games'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

const nextSort = (game: Game): number => Math.max(...Object.values(game.contests).map(x => x.sort)) + 1

export const getOne = async (gameId: string, contestId: string): Promise<Result<Contest>> => {
    const gameQuery = await gameService.getOne(gameId)
    if (isError(gameQuery)) {
        return gameQuery
    }

    const { value: game } = gameQuery
    const contest = game.contests[contestId]
    if (contest === undefined || contest === null) {
        return {
            status: 404,
            value: { message: `Could not find contest with id '${contestId}'` }
        }
    }

    return {
        status: 200,
        value: contest
    }
}

export const add = async (gameId: string): Promise<Result<Contest>> => {
    const gameQuery = await gameService.getOne(gameId)
    if (isError(gameQuery)) {
        return gameQuery
    }

    const { value: game } = gameQuery
    const contest: Contest = {
        id: nanoid(),
        sort: nextSort(game),
        status: 'new',
        strife: {
            strifeLevel: 5,
            dicePool: {
                rolled: false,
                score: undefined,
                dice: []
            },
            harmTags: [],
            targetNumber: undefined
        },
        contestants: {}
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    await repo.updateNested(gameId, `contests.${contest.id}`, contest)

    const result = await getOne(gameId, contest.id)
    if (isError(gameQuery)) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to retrieve persisted data from database' }
        }
    }

    return result
}

export const remove = async (gameId: string, contestId: string): Promise<Result<{}>> => {
    const gameQuery = await gameService.getOne(gameId)
    if (isError(gameQuery)) {
        return gameQuery
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    await repo.updateNested(gameId, `contests.${contestId}`, undefined)

    const result = await getOne(gameId, contestId)
    if (!isError(result)) {
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

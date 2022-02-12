import { nanoid } from 'nanoid'
import { getRepository } from '../repository/factory'
import { Contest, Game } from './Game'
import { isError, Result } from './Result'
import * as gameService from './games'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

const currentSort = (game: Game): number =>
    Math.max(0, ...Object.values(game.contests).map(x => x.sort))

const nextSort = (game: Game): number => currentSort(game) + 1

interface GetManyParams {
    gameId: string
}

interface GetOneParams extends GetManyParams {
    contestId: string
}

export const getOne = async ({ gameId, contestId }: GetOneParams): Promise<Result<Contest>> => {
    const gameQuery = await gameService.getOne({ gameId })
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

export const getMany = async ({ gameId }: GetManyParams): Promise<Result<Contest[]>> => {
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }

    return {
        status: 200,
        value: Object.values(gameQuery.value.contests).filter(x => x !== null)
    }
}

export const add = async ({ gameId }: GetManyParams): Promise<Result<Contest>> => {
    const gameQuery = await gameService.getOne({ gameId })
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

    const contestId = contest.id
    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(gameId, `contests.${contestId}`, contest)

    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to retrieve persisted data from database' }
        }
    }

    return {
        status: 200,
        value: contest
    }
}

export const remove = async ({ gameId, contestId }: GetOneParams): Promise<Result<{}>> => {
    const contestQuery = await getOne({ gameId, contestId })
    if (isError(contestQuery)) {
        return contestQuery
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.deleteNested(gameId, `contests.${contestId}`)
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

import { nanoid } from 'nanoid'
import { getRepository } from '../repository/factory'
import { Contest, ContestStatusType, Game } from './Game'
import { isError, Result } from './Result'
import * as gameService from './games'
import { rollStrife } from '../model'

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

interface ContestBody {
    status: ContestStatusType
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

const setTarget = async (params: GetOneParams, contest: Contest): Promise<Result<Contest>> => {
    const nextStrife = rollStrife(contest.strife)
    const next: Contest = {
        ...contest,
        status: 'targetSet',
        strife: {
            ...nextStrife
        }
    }

    const { gameId, contestId } = params
    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(gameId, `contests.${contestId}.strife`, next)
    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to retrieve persisted data from database' }
        }
    }

    return {
        status: 200,
        value: next
    }
}

const completeContest = async (_params: GetOneParams, _contest: Contest): Promise<Result<Contest>> => {
    // TODO
    // Check all players ready
    // Roll all players dice pools and calculate results
    // Update contest in database
    // Return new contest
    throw new Error('not implemented')
}

export const update = async (params: GetOneParams, body: ContestBody): Promise<Result<Contest>> => {
    const contestQuery = await getOne(params)
    if (isError(contestQuery)) {
        return contestQuery
    }

    switch (body.status) {
        case 'new': {
            return {
                status: 400,
                value: { message: 'Cannot update contest to status new' }
            }
        }
        case 'targetSet': {
            return await setTarget(params, contestQuery.value)
        }
        case 'complete': {
            return await completeContest(params, contestQuery.value)
        }
        default: {
            return {
                status: 400,
                value: { message: `Invalid contest status '${body.status}'` }
            }
        }
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

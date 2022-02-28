import { generateId } from '../factories/generateId'
import { getRepository } from '../repository/factory'
import { Contest, ContestStatusType, Game } from './Game'
import { isError, Result } from './Result'
import * as gameService from './games'
import { rollContest, rollStrife } from '../model'

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
    const contest = game!.contests[contestId]
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
        id: generateId(),
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
            value: { message: 'Unexpectedly failed to persist data to database' }
        }
    }

    return {
        status: 200,
        value: contest
    }
}

const setTarget = async ({ gameId, contestId }: GetOneParams, contest: Contest): Promise<Result<Contest>> => {
    if (contest.strife.dicePool.dice.length === 0) {
        return {
            status: 400,
            value: { message: 'Setting the contest target number requires at least one dice' }
        }
    }

    const nextStrife = rollStrife(contest.strife)
    const next: Contest = {
        ...contest,
        status: 'targetSet',
        strife: {
            ...nextStrife
        }
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(gameId, `contests.${contestId}`, next)
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

const completeContest = async ({ gameId, contestId }: GetOneParams, contest: Contest): Promise<Result<Contest>> => {
    if (Object.values(contest.contestants).some(x => !x.ready)) {
        return {
            status: 400,
            value: { message: 'All players must be ready before contest can be rolled' }
        }
    }

    const next = rollContest(contest)

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(gameId, `contests.${contestId}`, next)
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

const validStateChanges: { from: ContestStatusType, to: ContestStatusType }[] = [
    { from: 'new', to: 'targetSet' },
    { from: 'targetSet', to: 'complete' }
]

export const update = async (params: GetOneParams, body: ContestBody): Promise<Result<Contest>> => {
    const contestQuery = await getOne(params)
    if (isError(contestQuery)) {
        return contestQuery
    }

    const from = contestQuery.value.status
    const to = body.status
    if (!validStateChanges.some(x => x.from === from && x.to === to)) {
        return {
            status: 400,
            value: { message: `Cannot change contest state from '${from}' to '${to}'` }
        }
    }

    switch (body.status) {
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

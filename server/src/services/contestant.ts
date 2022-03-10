import { getRepository } from '../repository/factory'
import { Contestant, DiceType } from './Game'
import { isError, Result } from './Result'
import * as gameService from './games'
import * as contestService from './contests'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetOneParams {
    gameId: string
    contestId: string
    playerId: string
}

interface GetManyParams {
    gameId: string
    contestId: string
}

interface AddContestantBody {
    timestamp?: string | undefined
    playerId: string
}

interface ContestantBody {
    timestamp?: string | undefined
    ready: boolean
    dicePool: {
        dice: {
            type: DiceType
        }[]
    }
}

export const getOne = async ({ gameId, contestId, playerId }: GetOneParams): Promise<Result<Contestant>> => {
    const contestQuery = await contestService.getOne({ gameId, contestId })
    if (isError(contestQuery)) {
        return contestQuery
    }

    const value = contestQuery.value.contestants[playerId]
    if (value === undefined || value === null) {
        return {
            status: 404,
            value: { message: `Unable to find contestant with player id '${playerId}'` }
        }
    }

    return {
        status: 200,
        value
    }
}

export const getMany = async ({ gameId, contestId }: GetOneParams): Promise<Result<Contestant[]>> => {
    const contestQuery = await contestService.getOne({ gameId, contestId })
    if (isError(contestQuery)) {
        return contestQuery
    }

    const contestants = Object.values(contestQuery.value.contestants)
    return {
        status: 200,
        value: contestants
    }
}

export const add = async ({ gameId, contestId }: GetManyParams, body: AddContestantBody): Promise<Result<Contestant>> => {
    const gameQuery = await gameService.getOne({ gameId })
    if (isError(gameQuery)) {
        return gameQuery
    }
    const game = gameQuery.value
    const contest = game.contests[contestId]
    if (contest === undefined || contest === null) {
        return {
            status: 404,
            value: { message: `Unable to find contest with id '${contestId}'` }
        }
    }

    const { playerId, timestamp } = body
    if (!Object.keys(game.players).includes(playerId)) {
        return {
            status: 400,
            value: { message: `No player with id '${playerId}' found in the current game` }
        }
    }

    const contestant = {
        timestamp,
        playerId,
        ready: false,
        dicePool: {
            rolled: false,
            dice: []
        }
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(gameId, `contests.${contestId}.contestants.${playerId}`, contestant)

    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data to database' }
        }
    }

    return {
        status: 200,
        value: contestant
    }
}

export const update = async (params: GetOneParams, body: ContestantBody): Promise<Result<Contestant>> => {
    const contestantQuery = await getOne(params)
    if (isError(contestantQuery)) {
        return contestantQuery
    }

    const contestant = contestantQuery.value

    if (body.timestamp! < contestant.timestamp!) {
        return {
            status: 200,
            value: contestant
        }
    }

    if (body.ready) {
        if (body.dicePool.dice.filter(x => x.type !== 'd4').length < 2) {
            return {
                status: 400,
                value: { message: 'Cannot set ready unless at least two dice (d6-d12) are included in the dice pool' }
            }
        }
    }

    const next: Contestant = {
        ...contestant,
        ...body,
        dicePool: {
            ...contestant.dicePool,
            ...body.dicePool,
            dice: body.dicePool.dice.map(({ type }) => ({
                type
            }))
        }
    }

    const { gameId, contestId, playerId } = params
    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(
        gameId,
        `contests.${contestId}.contestants.${playerId}`,
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

export const remove = async ({ gameId, contestId, playerId }: GetOneParams): Promise<Result<{}>> => {
    const contestantQuery = await getOne({ gameId, contestId, playerId })
    if (isError(contestantQuery)) {
        return contestantQuery
    }

    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.deleteNested(gameId, `contests.${contestId}.contestants.${playerId}`)
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

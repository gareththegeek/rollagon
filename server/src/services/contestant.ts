import { getRepository } from '../repository/factory'
import { Contestant, DiceType } from './Game'
import { isError, Result } from './Result'
import * as contestService from './contests'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetOneParams {
    gameId: string
    contestId: string
    playerId: string
}

interface ContestantBody {
    ready: boolean
    dicePool: {
        rolled: boolean
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

export const update = async (params: GetOneParams, body: ContestantBody): Promise<Result<Contestant>> => {
    const contestantQuery = await getOne(params)
    if (isError(contestantQuery)) {
        return contestantQuery
    }

    const contestant = contestantQuery.value

    const next: Contestant = {
        ...contestant,
        ...body,
        dicePool: {
            ...contestant.dicePool,
            ...body.dicePool,
            dice: body.dicePool.dice.map(({ type }) => ({
                type,
                roll: undefined
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
            value: { message: 'Unexpectedly failed to retrieve persisted data from database' }
        }
    }

    return {
        status: 200,
        value: next
    }
}

import { getRepository } from '../repository/factory'
import { Contestant, Dice } from './Game'
import { isError, Result } from './Result'
import * as contestService from './contests'
import * as contestantService from './contestant'
import { rollDie } from '../model/rollDie'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetOneParams {
    gameId: string
    contestId: string
    playerId: string
}

interface NameDieBody extends Dice { }

export const update = async (params: GetOneParams, body: NameDieBody): Promise<Result<Contestant>> => {
    const contestantQuery = await contestantService.getOne(params)
    if (isError(contestantQuery)) {
        return contestantQuery
    }
    const contestQuery = await contestService.getOne(params)
    if (isError(contestQuery)) {
        return contestQuery
    }

    const contestant = contestantQuery.value
    const contest = contestQuery.value

    if (contest.status !== 'complete') {
        return {
            status: 400,
            value: { message: 'Cannot roll name die until contest has been resolved' }
        }
    }

    const next = rollDie(body.type)

    const { gameId, contestId, playerId } = params
    const repo = getRepository(GAME_COLLECTION_NAME)
    const result = await repo.updateNested(
        gameId,
        `contests.${contestId}.contestants.${playerId}.dicePool.nameDie`,
        next)

    if (!result) {
        return {
            status: 500,
            value: { message: 'Unexpectedly failed to persist data to database' }
        }
    }

    return {
        status: 200,
        value: {
            ...contestant,
            dicePool: {
                ...contestant.dicePool,
                nameDie: next
            }
        }
    }
}

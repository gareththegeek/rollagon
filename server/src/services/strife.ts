import { getRepository } from '../repository/factory'
import { DiceType, HarmTagType, Strife } from './Game'
import { isError, Result } from './Result'
import * as contestService from './contests'
import { rollStrife } from '../model'

const GAME_COLLECTION_NAME = process.env['GAME_COLLECTION_NAME'] ?? ''

interface GetOneParams {
    gameId: string
    contestId: string
}

interface StrifeBody {
    strifeLevel: number
    dicePool: {
        rolled: boolean
        dice: {
            type: DiceType
        }[]
    }
    harmTags: HarmTagType[]
}

export const getOne = async (params: GetOneParams): Promise<Result<Strife>> => {
    const contestQuery = await contestService.getOne(params)
    if (isError(contestQuery)) {
        return contestQuery
    }

    return {
        status: 200,
        value: contestQuery.value.strife
    }
}

export const update = async (params: GetOneParams, body: StrifeBody): Promise<Result<Strife>> => {
    const contestQuery = await contestService.getOne(params)
    if (isError(contestQuery)) {
        return contestQuery
    }

    const { strife } = contestQuery.value

    if (strife.dicePool.rolled) {
        return {
            status: 400,
            value: { message: 'Strife player has already rolled for this contest and so it cannot be modified' }
        }
    }

    const merged: Strife = {
        ...strife,
        ...body,
        dicePool: {
            ...strife.dicePool,
            ...body.dicePool,
            dice: body.dicePool.dice.map(({ type }) => ({
                type,
                roll: undefined
            }))
        }
    }

    const next = body.dicePool.rolled
        ? rollStrife(merged)
        : merged

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

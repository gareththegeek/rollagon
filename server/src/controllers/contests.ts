import { Request, Response } from 'express'
import { getContestParamSchema } from '../schema/contest'
import { wrapAsync } from './errors'
import * as service from '../services/contests'
import { idSchema } from '../schema/general'

export const getOne = wrapAsync(
    async ({ params }: Request, res: Response): Promise<Response | void> => {
        const validationResult = getContestParamSchema
            .validate(params)
        if (!!validationResult?.error) {
            return res
                .status(400)
                .send({ message: validationResult.error.details.map(x => x.message) })
        }

        const { gameId, contestId } = validationResult.value

        const { status, value } = await service.getOne(gameId, contestId)

        return res.status(status).send(value)
    }
)

export const add = wrapAsync(
    async ({ params: { id } }: Request, res: Response): Promise<Response | void> => {
        const validationResult = idSchema
            .label('game id')
            .validate(id, { abortEarly: false })
        if (!!validationResult.error) {
            return res
                .status(400)
                .send({ message: validationResult.error.details.map(x => x.message) })
        }

        const gameId = validationResult.value as string
        const { status, value } = await service.add(gameId)

        res.status(status).send(value)
    }
)

export const remove = wrapAsync(
    async ({ params }: Request, res: Response): Promise<Response | void> => {
        const validationResult = getContestParamSchema
            .validate(params, { abortEarly: false })
        if (!!validationResult.error) {
            return res
                .status(400)
                .send({ message: validationResult.error.details.map(x => x.message) })
        }

        let { gameId, contestId } = validationResult.value
        const { status, value } = await service.remove(gameId, contestId)

        res.status(status).send(value)
    }
)

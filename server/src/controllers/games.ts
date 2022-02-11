import { Request, Response } from 'express'
import { insertSchema } from '../schema/game'
import { idSchema } from '../schema/general'
import { wrapAsync } from './errors'
import * as service from '../services/games'
import { Game } from '../services/Game'

export const getOne = wrapAsync(
    async ({ params: { gameId } }: Request, res: Response): Promise<Response | void> => {
        const validationResult = idSchema
            .label('game id')
            .validate(gameId)
        if (!!validationResult?.error) {
            return res
                .status(400)
                .send({ message: validationResult.error.details.map(x => x.message) })
        }

        const validId = validationResult.value as string
        const { status, value } = await service.getOne(validId)

        return res.status(status).send(value)
    }
)

export const add = wrapAsync(
    async ({ body }: Request, res: Response): Promise<Response | void> => {
        const validationResult = insertSchema.validate(body, { abortEarly: false })
        if (!!validationResult.error) {
            return res
                .status(400)
                .send({ message: validationResult.error.details.map(x => x.message) })
        }

        const validGame = validationResult.value as Partial<Game>
        const { status, value } = await service.add(validGame)

        res.status(status).send(value)
    }
)

export const remove = wrapAsync(
    async ({ params: { gameId } }: Request, res: Response): Promise<Response | void> => {
        const validationResult = idSchema
            .label('game id')
            .validate(gameId, { abortEarly: false })
        if (!!validationResult.error) {
            return res
                .status(400)
                .send({ message: validationResult.error.details.map(x => x.message) })
        }

        let validId = validationResult.value as string
        const { status, value } = await service.remove(validId)

        res.status(status).send(value)
    }
)

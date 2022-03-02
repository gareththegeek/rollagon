import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { Game } from '../services/Game'
import { idSchema } from './general'
import * as service from '../services/games'

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id')
})

export const addParamsSchema = Joi.object({})

export const addSchema = Joi.object({})

export const controllerConfig: ControllerConfig<Game> = {
    topic: 'games',
    service,
    getOneParamsSchema,
    addParamsSchema,
    addSchema,
    removeParamsSchema: getOneParamsSchema
}

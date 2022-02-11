import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { Game } from '../services/Game'
import { idSchema, stringSchema } from './general'
import * as service from '../services/games'

const nameSchema = stringSchema
    .max(128)
    .required()

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id')
})

export const addParamsSchema = Joi.object({})

export const addSchema = Joi.object({
    name: nameSchema
})

export const controllerConfig: ControllerConfig<Game> = {
    service,
    getOneParamsSchema,
    addParamsSchema,
    addSchema,
    removeParamsSchema: getOneParamsSchema
}
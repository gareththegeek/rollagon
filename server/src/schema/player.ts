import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { Player } from '../services/Game'
import * as service from '../services/players'
import { idSchema, stringSchema } from './general'

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id'),
    playerId: idSchema.label('player id')
})

export const getManyParamsSchema = Joi.object({
    gameId: idSchema.label('game id')
})

const nameSchema = stringSchema
    .max(128)
    .required()

export const addSchema = Joi.object({
    name: nameSchema
})

export const controllerConfig: ControllerConfig<Player> = {
    service,
    getOneParamsSchema,
    getManyParamsSchema,
    addParamsSchema: getManyParamsSchema,
    addSchema,
    removeParamsSchema: getOneParamsSchema
}

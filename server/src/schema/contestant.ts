import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { idSchema } from './general'
import * as service from '../services/contestant'
import { Contestant } from '../services/Game'
import { dicePoolSchema } from './dicePool'

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id'),
    contestId: idSchema.label('contest id'),
    playerId: idSchema.label('player id')
})

export const getManyParamsSchema = Joi.object({
    gameId: idSchema.label('game id'),
    contestId: idSchema.label('contest id')
})

export const addSchema = Joi.object({
    playerId: idSchema.label('player id')
})

export const updateSchema = Joi.object({
    ready: Joi.boolean().required(),
    dicePool: dicePoolSchema.required()
})

export const controllerConfig: ControllerConfig<Contestant> = {
    service,
    getOneParamsSchema,
    getManyParamsSchema,
    addParamsSchema: getManyParamsSchema,
    addSchema,
    updateParamsSchema: getOneParamsSchema,
    updateSchema,
    removeParamsSchema: getOneParamsSchema
}

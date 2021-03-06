import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { idSchema } from './general'
import * as service from '../services/contests'
import { Contest } from '../services/Game'

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id'),
    contestId: idSchema.label('contest id')
})

export const getManyParamsSchema = Joi.object({
    gameId: idSchema.label('game id')
})

export const addSchema = Joi.object({
    timestamp: Joi.date().iso().required()
})

export const updateSchema = Joi.object({
    timestamp: Joi.date().iso().required(),
    status: Joi.string()
        .valid('new', 'targetSet', 'complete')
        .required()
})

export const controllerConfig: ControllerConfig<Contest> = {
    topic: 'contest',
    service,
    getOneParamsSchema,
    getManyParamsSchema,
    addParamsSchema: getManyParamsSchema,
    addSchema,
    updateParamsSchema: getOneParamsSchema,
    updateSchema: updateSchema,
    removeParamsSchema: getOneParamsSchema
}

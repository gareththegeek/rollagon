import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { idSchema } from './general'
import * as service from '../services/contests'
import { Contest } from '../services/Game'

export const getOneParamSchema = Joi.object({
    gameId: idSchema.label('game id'),
    contestId: idSchema.label('contest id')
})

export const getManyParamSchema = Joi.object({
    gameId: idSchema.label('game id')
})

export const controllerConfig: ControllerConfig<Contest> = {
    service,
    getOneParamsSchema: getOneParamSchema,
    addParamsSchema: getManyParamSchema,
    removeParamsSchema: getOneParamSchema
}

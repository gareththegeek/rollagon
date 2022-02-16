import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { idSchema } from './general'
import * as service from '../services/strife'
import { Strife } from '../services/Game'
import { dicePoolSchema } from './dicePool'

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id'),
    contestId: idSchema.label('contest id')
})

export const updateSchema = Joi.object({
    strifeLevel: Joi.number().required(),
    dicePool: dicePoolSchema.required(),
    harmTags: Joi
        .array()
        .items(
            Joi.string()
            .valid('sacred', 'perilous', 'mythic', 'epic')
        )
})

export const controllerConfig: ControllerConfig<Strife> = {
    topic: 'strife',
    service,
    getOneParamsSchema,
    updateParamsSchema: getOneParamsSchema,
    updateSchema
}

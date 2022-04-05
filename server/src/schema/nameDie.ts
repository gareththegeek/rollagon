import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { idSchema } from './general'
import * as service from '../services/nameDie'
import { Contestant } from '../services/Game'
import { diceSchema } from './dicePool'
import { Service } from '../services/Service'

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id'),
    contestId: idSchema.label('contest id'),
    playerId: idSchema.label('player id')
})

export const updateSchema = diceSchema

export const controllerConfig: ControllerConfig<Contestant> = {
    topic: 'nameDie',
    service: service as unknown as Service<Contestant>,
    updateParamsSchema: getOneParamsSchema,
    updateSchema
}

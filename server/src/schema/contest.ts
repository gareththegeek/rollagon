import Joi from 'joi'
import { idSchema } from './general'

export const getContestParamSchema = Joi.object({
    gameId: idSchema.label('game id'),
    contestId: idSchema.label('contest id')
})

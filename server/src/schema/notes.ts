import Joi from 'joi'
import { ControllerConfig } from '../controllers/ControllerConfig'
import { Note } from '../services/Game'
import { idSchema } from './general'
import * as service from '../services/notes'

export const getOneParamsSchema = Joi.object({
    gameId: idSchema.label('game id'),
    noteId: idSchema.label('note id')
})

export const getManyParamsSchema = Joi.object({
    gameId: idSchema.label('game id')
})

export const addSchema = Joi.object({
    timestamp: Joi.date().iso().required(),
    text: Joi.string().max(512).required()
})

export const controllerConfig: ControllerConfig<Note> = {
    topic: 'note',
    service,
    getOneParamsSchema,
    getManyParamsSchema,
    addParamsSchema: getManyParamsSchema,
    addSchema,
    updateParamsSchema: getOneParamsSchema,
    updateSchema: addSchema,
    removeParamsSchema: getOneParamsSchema
}

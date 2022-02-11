import Joi from 'joi'
import { stringSchema } from './general'

const nameSchema = stringSchema
    .max(128)
    .required()

export const insertSchema = Joi.object({
    name: nameSchema
})

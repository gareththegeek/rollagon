import Joi from 'joi'
import { dateSchema, stringSchema } from './general'

export const idSchema = Joi
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{21}$/)
    .required()

const nameSchema = stringSchema
    .max(128)
    .required()

export const insertSchema = Joi.object({
    name: nameSchema
})

export const getSchema = Joi.object({
    id: idSchema,
    name: nameSchema,
    createdOn: dateSchema
})

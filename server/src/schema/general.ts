import Joi from 'joi'

export const stringSchema = Joi
    .string()
    .trim()
    .regex(/^[^"|.|$|{|}]+$/)

export const dateSchema = Joi
    .date()
    .iso()
    .required()

import Joi from 'joi'

export const idSchema = Joi
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{21}$/)
    .required()
    
export const stringSchema = Joi
    .string()
    .trim()
    .regex(/^[^"|.|$|{|}]+$/)

export const dateSchema = Joi
    .date()
    .iso()
    .required()

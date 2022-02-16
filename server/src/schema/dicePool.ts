import Joi from 'joi'

export const diceSchema = Joi.object({
    type: Joi
        .string()
        .valid('d4', 'd6', 'd8', 'd10', 'd12')
        .required()
})

export const dicePoolSchema = Joi.object({
    dice: Joi.array().items(diceSchema).required()
})

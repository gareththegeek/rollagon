import Joi from 'joi'
import { Service } from '../services/Service'

export interface ControllerConfig<T> {
    service: Service<T>
    getOneParamsSchema?: Joi.ObjectSchema
    getManyParamsSchema?: Joi.ObjectSchema
    addParamsSchema?: Joi.ObjectSchema
    addSchema?: Joi.ObjectSchema
    updateParamsSchema?: Joi.ObjectSchema
    updateSchema?: Joi.ObjectSchema
    removeParamsSchema?: Joi.ObjectSchema
}

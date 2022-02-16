import { Request, Response } from 'express'
import { Socket } from '../websockets'
import { wrapAsync } from './errors'
import { ControllerConfig } from './ControllerConfig'

export const bind = <T>(config: ControllerConfig<T>) => {
    const getOne = wrapAsync(
        async ({ params }: Request, res: Response): Promise<Response | void> => {
            const paramsValidationResult = config
                .getOneParamsSchema!
                .validate(params)
            if (!!paramsValidationResult?.error) {
                return res
                    .status(400)
                    .send({ message: paramsValidationResult.error.details.map(x => x.message) })
            }

            const { status, value } = await config.service.getOne!(paramsValidationResult.value)

            return res.status(status).send(value)
        }
    )

    const getMany = wrapAsync(
        async ({ params }: Request, res: Response): Promise<Response | void> => {
            const paramsValidationResult = config
                .getManyParamsSchema!
                .validate(params)
            if (!!paramsValidationResult?.error) {
                return res
                    .status(400)
                    .send({ message: paramsValidationResult.error.details.map(x => x.message) })
            }

            const { status, value } = await config.service.getMany!(paramsValidationResult.value)

            return res.status(status).send(value)
        }
    )

    const add = wrapAsync(
        async ({ params, body }: Request, res: Response): Promise<Response | void> => {
            const paramsValidationResult = config
                .addParamsSchema!
                .validate(params, { abortEarly: false })
            if (!!paramsValidationResult.error) {
                return res
                    .status(400)
                    .send({ message: paramsValidationResult.error.details.map(x => x.message) })
            }

            const validationResult = config
                .addSchema!
                .validate(body, { abortEarly: false })
            if (!!validationResult.error) {
                return res
                    .status(400)
                    .send({ message: validationResult.error.details.map(x => x.message) })
            }

            const { status, value } = await config.service.add!(
                paramsValidationResult.value,
                validationResult.value
            )

            if (status === 200) {
                Socket.send(`${config.topic}.add`, { params, value })
            }

            res.status(status).send(value)
        }
    )

    const update = wrapAsync(
        async ({ params, body }: Request, res: Response): Promise<Response | void> => {
            const paramsValidationResult = config
                .updateParamsSchema!
                .validate(params, { abortEarly: false })
            if (!!paramsValidationResult.error) {
                return res
                    .status(400)
                    .send({ message: paramsValidationResult.error.details.map(x => x.message) })
            }

            const validationResult = config
                .updateSchema!
                .validate(body, { abortEarly: false })
            if (!!validationResult.error) {
                return res
                    .status(400)
                    .send({ message: validationResult.error.details.map(x => x.message) })
            }

            const { status, value } = await config.service.update!(
                paramsValidationResult.value,
                validationResult.value
            )

            if (status === 200) {
                Socket.send(`${config.topic}.update`, { params, value })
            }

            res.status(status).send(value)
        }
    )

    const remove = wrapAsync(
        async ({ params }: Request, res: Response): Promise<Response | void> => {
            const validationResult = config
                .removeParamsSchema!
                .validate(params, { abortEarly: false })
            if (!!validationResult.error) {
                return res
                    .status(400)
                    .send({ message: validationResult.error.details.map(x => x.message) })
            }

            const { status, value } = await config.service.remove!(validationResult.value)

            if (status === 200) {
                Socket.send(`${config.topic}.remove`, { params })
            }

            res.status(status).send(value)
        }
    )

    return {
        getOne,
        getMany,
        add,
        update,
        remove
    }
}

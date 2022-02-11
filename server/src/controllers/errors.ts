import { NextFunction, Request, RequestHandler, Response } from 'express'

process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
})

const isDevEnvironment = () => process.env['NODE_ENV'] === 'development'

export const handler = (err: any | undefined, _: Request, res: Response, next: NextFunction) => {
    if (isDevEnvironment()) {
        next(err)
        return
    }

    console.error(err)
    if (err !== undefined && err.hasOwnProperty('statusCode')) {
        res.status(err.statusCode).send({ message: err.message })
        return
    }
    res.status(500).json({ message: 'Internal server error' })
}

type PartialRequestHandler = (req: Request, res: Response) => Promise<unknown>

export const wrapAsync = (handler: PartialRequestHandler): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            return await handler(req, res) as Promise<Response | void>
        }
        catch (e) {
            next(e)
        }
    }

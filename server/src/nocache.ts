import { NextFunction, Request, Response } from 'express'
import onHeaders from 'on-headers'

export const middleware = (_: Request, res: Response, next: NextFunction) => {
    onHeaders(res, () => {
        res.removeHeader('ETag')
    })
    next()
}

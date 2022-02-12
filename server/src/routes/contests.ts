import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/contests'

const bind = (app: Express): void => {
    const {
        getOne,
        getMany,
        add,
        remove
    } = controllers.contests

    app.get(`${routePrefix}/:contestId`, getOne)
    app.get(`${routePrefix}`, getMany)
    app.post(routePrefix, add)
    app.delete(`${routePrefix}/:contestId`, remove)
}

export default bind

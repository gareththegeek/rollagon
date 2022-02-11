import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/contests'

const bind = (app: Express): void => {
    const {
        getOne,
        add,
        remove
    } = controllers.contests

    app.get(`${routePrefix}/:contestId`, getOne)
    app.post(routePrefix, add)
    app.delete(`${routePrefix}/:contestId`, remove)
}

export default bind

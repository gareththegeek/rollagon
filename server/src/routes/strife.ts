import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/contests/:contestId/strife'

const bind = (app: Express): void => {
    const {
        getOne,
        update
    } = controllers.strife

    app.get(routePrefix, getOne)
    app.put(routePrefix, update)
}

export default bind

import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/contests/:contestId/contestants'

const bind = (app: Express): void => {
    const {
        getOne,
        add,
        update,
        remove
    } = controllers.contestants

    app.get(`${routePrefix}/:playerId`, getOne)
    app.post(routePrefix, add)
    app.put(`${routePrefix}/:playerId`, update)
    app.delete(`${routePrefix}/:playerId`, remove)
}

export default bind

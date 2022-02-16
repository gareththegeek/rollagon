import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/contests/:contestId/contestants'

const bind = (app: Express): void => {
    const {
        getOne,
        getMany,
        add,
        update,
        remove
    } = controllers.contestants

    app.get(`${routePrefix}/:playerId`, getOne)
    app.get(routePrefix, getMany)
    app.post(routePrefix, add)
    app.put(`${routePrefix}/:playerId`, update)
    app.delete(`${routePrefix}/:playerId`, remove)
}

export default bind

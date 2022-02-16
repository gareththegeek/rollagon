import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/players'

const bind = (app: Express): void => {
    const {
        getMany,
        getOne,
        add,
        update,
        remove
    } = controllers.players

    app.get(`${routePrefix}/:playerId`, getOne)
    app.get(routePrefix, getMany)
    app.post(routePrefix, add)
    app.put(`${routePrefix}/:playerId`, update)
    app.delete(`${routePrefix}/:playerId`, remove)
}

export default bind

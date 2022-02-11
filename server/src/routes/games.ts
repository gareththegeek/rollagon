import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games'

const bind = (app: Express): void => {
    const {
        getOne,
        add,
        remove
    } = controllers.games

    app.get(`${routePrefix}/:id`, getOne)
    app.post(routePrefix, add)
    app.delete(`${routePrefix}/:id`, remove)
}

export default bind

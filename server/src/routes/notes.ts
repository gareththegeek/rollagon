import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/notes'

const bind = (app: Express): void => {
    const {
        getOne,
        getMany,
        add,
        update,
        remove
    } = controllers.notes

    app.get(`${routePrefix}/:noteId`, getOne)
    app.get(`${routePrefix}`, getMany)
    app.post(routePrefix, add)
    app.put(`${routePrefix}/:noteId`, update)
    app.delete(`${routePrefix}/:noteId`, remove)
}

export default bind

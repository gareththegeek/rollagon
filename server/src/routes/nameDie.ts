import { Express } from 'express'
import controllers from '../controllers'

const routePrefix = '/api/games/:gameId/contests/:contestId/contestants/:playerId/nameDie'

const bind = (app: Express): void => {
    const {
        update
    } = controllers.nameDie

    app.put(routePrefix, update)
}

export default bind

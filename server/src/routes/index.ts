import { Express } from 'express'
import contests from './contests'
import games from './games'
import players from './players'

const bind = (app: Express): void => {
    contests(app)
    games(app)
    players(app)
}

export default bind

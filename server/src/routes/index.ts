import { Express } from 'express'
import contests from './contests'
import games from './games'
import players from './players'
import strife from './strife'

const bind = (app: Express): void => {
    contests(app)
    games(app)
    players(app)
    strife(app)
}

export default bind

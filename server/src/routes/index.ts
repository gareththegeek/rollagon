import { Express } from 'express'
import contests from './contests'
import games from './games'

const bind = (app: Express): void => {
    contests(app)
    games(app)
}

export default bind

import { Express } from 'express'
import games from './games'

const bind = (app: Express): void => {
    games(app)
}

export default bind

import { Express } from 'express'
import contests from './contests'
import contestants from './contestants'
import games from './games'
import nameDie from './nameDie'
import notes from './notes'
import players from './players'
import strife from './strife'

const bind = (app: Express): void => {
    nameDie(app)
    contestants(app)
    contests(app)
    games(app)
    notes(app)
    players(app)
    strife(app)
}

export default bind

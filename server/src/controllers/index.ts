import { bind } from './generic'
import { controllerConfig as contestConfig } from '../schema/contest'
import { controllerConfig as gamesConfig } from '../schema/game'
import { controllerConfig as playersConfig } from '../schema/player'
import * as errors from './errors'

export default {
    errors,
    contests: bind(contestConfig),
    games: bind(gamesConfig),
    players: bind(playersConfig)
}

import { bind } from './generic'
import { controllerConfig as contestConfig } from '../schema/contest'
import { controllerConfig as gamesConfig } from '../schema/game'
import { controllerConfig as playersConfig } from '../schema/player'
import { controllerConfig as strifeConfig } from '../schema/strife'
import * as errors from './errors'

export default {
    errors,
    contests: bind(contestConfig),
    games: bind(gamesConfig),
    players: bind(playersConfig),
    strife: bind(strifeConfig)
}

import { bind } from './generic'
import { controllerConfig as contestantsConfig } from '../schema/contestant'
import { controllerConfig as contestsConfig } from '../schema/contest'
import { controllerConfig as gamesConfig } from '../schema/game'
import { controllerConfig as nameDieConfig } from '../schema/nameDie'
import { controllerConfig as playersConfig } from '../schema/player'
import { controllerConfig as strifeConfig } from '../schema/strife'
import * as errors from './errors'

export default {
    errors,
    contestants: bind(contestantsConfig),
    contests: bind(contestsConfig),
    games: bind(gamesConfig),
    nameDie: bind(nameDieConfig),
    players: bind(playersConfig),
    strife: bind(strifeConfig)
}

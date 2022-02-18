import { Contestant } from '../../src/services/Game'

export const mockContestant = (playerId: string): Contestant => ({
    playerId,
    prevail: undefined,
    ready: false,
    dicePool: {
        rolled: false,
        score: undefined,
        dice: []
    }
})

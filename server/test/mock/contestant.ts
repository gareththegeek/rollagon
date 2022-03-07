import { Contestant } from '../../src/services/Game'

export const mockContestant = (playerId: string): Contestant => ({
    timestamp: '2022-01-01T00:00:00.000Z',
    playerId,
    prevail: undefined,
    ready: false,
    dicePool: {
        rolled: false,
        score: undefined,
        dice: []
    }
})

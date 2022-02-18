import { Strife } from '../../src/services/Game'

export const mockStrife = (): Strife => ({
    strifeLevel: 5,
    targetNumber: undefined,
    harmTags: ['sacred'],
    dicePool: {
        rolled: false,
        score: undefined,
        dice: [
            { type: 'd8', roll: undefined },
            { type: 'd10', roll: undefined }
        ]
    }
})

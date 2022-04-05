import { getRandom } from '../factories/getRandom'
import { Dice, DiceType } from '../services/Game'

const DiceMax: Record<DiceType, number> = {
    'd4': 4,
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
}

export const rollDie = (type: DiceType): Dice => ({
    type,
    roll: Math.floor(getRandom() * DiceMax[type]) + 1
})

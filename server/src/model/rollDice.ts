import { getRandom } from '../factories/getRandom'
import { Dice, DiceType } from '../services/Game'

const DiceMax: Record<DiceType, number> = {
    'd4': 4,
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
}

export const rollDice = (dice: Dice[]): Dice[] => {
    const result = dice.map(({ type }) => ({
        type,
        roll: Math.floor(getRandom() * DiceMax[type]) + 1
    }))
    result.sort((a, b) => {
        if (a.type === 'd4' && b.type !== 'd4') {
            return 1
        } else if (a.type !== 'd4' && b.type === 'd4') {
            return -1
        }
        return b.roll - a.roll
    })
    return result
}

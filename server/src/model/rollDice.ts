import { Dice } from '../services/Game'
import { rollDie } from './rollDie'

export const rollDice = (dice: Dice[]): Dice[] => {
    const result = dice.map(({ type }) => rollDie(type))
    result.sort((a, b) => {
        if (a.type === 'd4' && b.type !== 'd4') {
            return 1
        } else if (a.type !== 'd4' && b.type === 'd4') {
            return -1
        }
        return b.roll! - a.roll!
    })
    return result
}

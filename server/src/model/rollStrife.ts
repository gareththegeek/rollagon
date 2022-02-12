import { rollDice } from '.'
import { Strife } from '../services/Game'

export const rollStrife = (strife: Strife): Strife => {
    const result = { ...strife }
    result.dicePool.dice = rollDice(result.dicePool.dice)
    result.dicePool.score = Math.max(...result.dicePool.dice.map(({ roll }) => roll!))
    result.targetNumber = result.dicePool.score + result.strifeLevel
    return result
}

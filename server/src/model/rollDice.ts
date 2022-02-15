import { Dice, DiceType } from '../services/Game'

const DiceMax: Record<DiceType, number> = {
    'd4': 4,
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
}

export const rollDice = (dice: Dice[]): Dice[] =>
    dice.map(({ type }) => ({
        type,
        roll: Math.floor(Math.random() * DiceMax[type]) + 1
    }))
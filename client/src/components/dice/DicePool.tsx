import React from 'react'
import { DicePool as DicePoolType } from '../../api/contests'
import { Dice } from './Dice'

export interface DicePoolProps {
    dicePool: DicePoolType
}

export const DicePool = ({ dicePool }: DicePoolProps) => {
    return <>{dicePool.dice.map((dice, idx) => <Dice key={`dice-${idx}`} dice={dice} />)}</>
}

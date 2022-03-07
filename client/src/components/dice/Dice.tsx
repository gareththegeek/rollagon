import React from 'react'
import { Dice as DiceType } from '../../api/contests'

export interface DiceProps {
    dice: DiceType
}

export const Dice = ({ dice }: DiceProps) => {
    return <div>{dice.type}</div>
}
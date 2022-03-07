import React from 'react'
import { Strife } from '../../api/strife'
import { Roll } from './Roll'

export interface StrifeRollProps {
    strife: Strife
}

export const StrifeRoll = ({ strife }: StrifeRollProps) => {
    const best = strife.dicePool.dice[0]
    return (
        <div>
            <Roll value={strife.targetNumber!} label="Target" />
            <Roll value={strife.strifeLevel} label="Strife" /> + <Roll value={best.roll!} label={best.type} />
        </div>
    )
}

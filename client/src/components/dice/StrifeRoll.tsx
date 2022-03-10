import React from 'react'
import { Strife } from '../../api/strife'
import { Roll } from './Roll'

export interface StrifeRollProps {
    strife: Strife
}

export const StrifeRoll = ({ strife }: StrifeRollProps) => {
    const [best, ...rest] = strife.dicePool.dice
    return (
        <div>
            <Roll value={strife.targetNumber!} label="Target" />
            <Roll value={strife.strifeLevel} label="Strife" /> + <Roll value={best.roll!} label={best.type} />
            {rest.length > 0 && (
                <div>
                    (
                    {rest.map((x) => (
                        <Roll value={x.roll!} label={x.type} />
                    ))}
                    )
                </div>
            )}
        </div>
    )
}

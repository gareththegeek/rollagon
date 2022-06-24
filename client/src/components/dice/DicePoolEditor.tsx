import React from 'react'
import { DicePool } from '../../api/contestants'
import { DiceEditor } from './DiceEditor'

export interface DicePoolEditorProps {
    dice: number[]
    dicePool: DicePool
    enabled: boolean
    onChange: (type: string, quantity: number) => void
}

const getQuantity = (dice: number, dicePool: DicePool) => dicePool.dice.filter((x) => x.type === `d${dice}`).length

export const DicePoolEditor = ({ dice, dicePool, enabled, onChange }: DicePoolEditorProps) => {
    return (
        <>
            {dice
                .filter((d) => enabled || getQuantity(d, dicePool) > 0)
                .map((d) => (
                    <DiceEditor
                        key={`edit-dice-d${d}`}
                        type={d}
                        quantity={dicePool.dice.filter((x) => x.type === `d${d}`).length}
                        enabled={enabled}
                        onChange={(quantity: number) => onChange(`d${d}`, quantity)}
                    />
                ))}
        </>
    )
}

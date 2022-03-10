import React from 'react'
import { DiceEditor } from './DiceEditor'

export interface DicePoolEditorProps {
    dice: number[]
    enabled: boolean
    onChange: (type: string, quantity: number) => void
}

export const DicePoolEditor = ({ dice, enabled, onChange }: DicePoolEditorProps) => {
    return <>
        {dice.map(d =>
            <DiceEditor
                key={`edit-dice-d${d}`}
                type={d}
                initialQuantity={0}
                enabled={enabled}
                onChange={(quantity: number) => onChange(`d${d}`, quantity)}
            />)}
    </>
}

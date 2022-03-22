import React from 'react'
import { SmallButton } from '../../components/SmallButton'

export interface StrifeLevelEditorProps {
    onChange: (level: number) => void
    current: number
}

export const StrifeLevelEditor = ({ current, onChange }: StrifeLevelEditorProps) => {
    const levels = [
        { name: 'None', value: 0 },
        { name: '+4', value: 4 },
        { name: '+5', value: 5 },
        { name: '+6', value: 6 }
    ]

    //TODO highlight button if value === current
    return (
        <>
            {levels.map(({ name, value }, idx) => (
                <SmallButton
                    key={`strife-level-${idx}`}
                    disabled={current === value}
                    selected={current === value}
                    onClick={() => {
                        onChange(value)
                    }}
                >
                    {name}
                </SmallButton>
            ))}
        </>
    )
}

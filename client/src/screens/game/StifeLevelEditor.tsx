import React from 'react'

export interface StrifeLevelEditorProps {
    onChange: (level: number) => void
}

export const StrifeLevelEditor = ({ onChange }: StrifeLevelEditorProps) => {
    const levels = [
        { name: 'None', value: 0 },
        { name: '+4', value: 4 },
        { name: '+5', value: 5 },
        { name: '+6', value: 6 }
    ]

    //TODO highlight button if value === current
    return <>
        {levels.map(({ name, value }, idx) =>
            <button key={`strife-level-${idx}`}
                onClick={() => {
                    onChange(value)
                }}>
                {name}
            </button>)}
    </>
}

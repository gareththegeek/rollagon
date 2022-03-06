import React, { useState } from 'react'

export interface HarmTagEditorProps {
    name: string
    onChange: (toggled: boolean) => void
}

export const HarmTagEditor = ({ name, onChange }: HarmTagEditorProps) => {
    const [toggled, setToggled] = useState(false)
    return <button onClick={() => {
        const next = !toggled
        setToggled(next)
        onChange(next)
    }}>{name}</button>
}

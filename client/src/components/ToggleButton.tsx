import React, { useState } from 'react'

export interface ToggleButtonProps {
    label: string
    enabled: boolean
    onChange: (toggled: boolean) => void
}

export const ToggleButton = ({ label, enabled, onChange }: ToggleButtonProps) => {
    const [toggled, setToggled] = useState(false)
    return (
        <button
            disabled={!enabled}
            onClick={() => {
                const next = !toggled
                setToggled(next)
                onChange(next)
            }}
        >
            {label}
        </button>
    )
}

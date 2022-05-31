import React from 'react'
import { SmallButton } from './SmallButton'

export interface ToggleButtonProps {
    label: string
    enabled: boolean
    toggled: boolean
    className?: string | undefined
    onChange: (toggled: boolean) => void
}

export const ToggleButton = ({ className, label, enabled, onChange, toggled }: ToggleButtonProps) => {
    return (
        <SmallButton
            disabled={!enabled}
            selected={toggled}
            className={`${className}`}
            onClick={() => {
                const next = !toggled
                onChange(next)
            }}
        >
            <input type='checkbox' checked={toggled} className="mr-2" /><span>{label}</span>
        </SmallButton>
    )
}

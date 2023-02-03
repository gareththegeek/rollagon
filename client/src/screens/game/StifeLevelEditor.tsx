import React from 'react'
import { useTranslation } from 'react-i18next'
import { SmallButton } from '../../components/SmallButton'

export interface StrifeLevelEditorProps {
    onChange: (level: number) => void
    current: number
}

export const StrifeLevelEditor = ({ current, onChange }: StrifeLevelEditorProps) => {
    const { t } = useTranslation()
    const levels = [
        { name: '0', value: 0 },
        { name: '+4', value: 4 },
        { name: '+5', value: 5 },
        { name: '+6', value: 6 }
    ]

    return (
        <div role="radiogroup" aria-label={t('Strife Level') ?? ""} className="flex gap-2 md:gap-4">
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
        </div>
    )
}

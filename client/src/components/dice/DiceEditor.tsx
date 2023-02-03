import React from 'react'
import { useTranslation } from 'react-i18next'
import { SmallButton } from '../SmallButton'

export interface DiceEditorProps {
    type: number
    quantity: number
    enabled: boolean
    onChange: (value: number) => void
}

export const DiceEditor = ({ type, quantity, enabled, onChange }: DiceEditorProps) => {
    const border = enabled ? 'border-y-2' : 'border-2'
    const { t } = useTranslation()
    return (
        <div className="flex">
            {enabled && (
                <SmallButton
                    disabled={quantity === 0}
                    extraSmall={true}
                    aria-label={`${t('Remove')} d${type}`}
                    onClick={() => {
                        const newQuantity = quantity - 1
                        onChange(newQuantity)
                    }}
                >
                    -
                </SmallButton>
            )}
            <div
                className={`${border} w-14 py-1 px-2 text-center ${quantity > 0 && 'bg-grey-300'}`}
                role="spinbutton"
                aria-label={`d${type}`}
                aria-valuenow={quantity}
                aria-valuetext={`${quantity}d${type}`}
                aria-valuemin={0}
            >
                {quantity}d{type}
            </div>
            {enabled && (
                <SmallButton
                    disabled={!enabled}
                    extraSmall={true}
                    aria-label={`${t('Add')} d${type}`}
                    onClick={() => {
                        const newQuantity = quantity + 1
                        onChange(newQuantity)
                    }}
                >
                    +
                </SmallButton>
            )}
        </div>
    )
}

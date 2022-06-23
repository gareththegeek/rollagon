import React from 'react'
import { SmallButton } from '../SmallButton'

export interface DiceEditorProps {
    type: number
    quantity: number
    enabled: boolean
    onChange: (value: number) => void
}

export const DiceEditor = ({ type, quantity, enabled, onChange }: DiceEditorProps) => {
    const border = enabled ? 'border-y-2' : 'border-2 mr-4'
    return (
        <div className="my-4 flex">
            {enabled && (
                <SmallButton
                    disabled={quantity === 0}
                    collapseRight={true}
                    aria-label={`Remove d${type}`}
                    onClick={() => {
                        const newQuantity = quantity - 1
                        onChange(newQuantity)
                    }}
                >
                    -
                </SmallButton>
            )}
            <div
                className={`${border} py-1 px-2 ${quantity > 0 && 'bg-grey-300'}`}
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
                    aria-label={`Add d${type}`}
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

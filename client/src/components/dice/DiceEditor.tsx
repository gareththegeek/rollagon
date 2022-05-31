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
        <>
            {enabled && (
                <SmallButton
                    disabled={quantity === 0}
                    collapseRight={true}
                    onClick={() => {
                        const newQuantity = quantity - 1
                        onChange(newQuantity)
                    }}
                >
                    -
                </SmallButton>
            )}
            <div className={`${border} py-1 px-2 ${quantity > 0 && 'bg-grey-300' }`}>
                {quantity}d{type}
            </div>
            {enabled && (
                <SmallButton
                    disabled={!enabled}
                    onClick={() => {
                        const newQuantity = quantity + 1
                        onChange(newQuantity)
                    }}
                >
                    +
                </SmallButton>
            )}
        </>
    )
}

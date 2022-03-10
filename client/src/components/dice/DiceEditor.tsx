import React, { useState } from 'react'

export interface DiceEditorProps {
    type: number
    quantity: number
    enabled: boolean
    onChange: (value: number) => void
}

export const DiceEditor = ({ type, quantity, enabled, onChange }: DiceEditorProps) => {
    //const [quantity, setQuantity] = useState(initialQuantity)

    return (
        <div>
            {enabled && (
                <button
                    disabled={quantity === 0}
                    onClick={() => {
                        const newQuantity = quantity - 1
                        onChange(newQuantity)
                    }}
                >
                    -
                </button>
            )}
            <div>
                {quantity}d{type}
            </div>
            {enabled && (
                <button
                    disabled={!enabled}
                    onClick={() => {
                        const newQuantity = quantity + 1
                        onChange(newQuantity)
                    }}
                >
                    +
                </button>
            )}
        </div>
    )
}

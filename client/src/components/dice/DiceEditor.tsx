import React, { useState } from 'react'

export interface DiceEditorProps {
    type: number
    initialQuantity: number
    onChange: (value: number) => void
}

export const DiceEditor = ({ type, initialQuantity, onChange }: DiceEditorProps) => {
    const [quantity, setQuantity] = useState(initialQuantity)

    return <div>
        <button disabled={quantity === 0} onClick={() => {
            const newQuantity = quantity - 1
            setQuantity(newQuantity)
            onChange(newQuantity)
        }}>-</button>
        <div>{quantity}d{type}</div>
        <button onClick={() => {
            const newQuantity = quantity + 1
            setQuantity(newQuantity)
            onChange(newQuantity)
        }}>+</button>
    </div>
}

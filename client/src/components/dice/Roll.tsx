import React from 'react'

export interface RollProps {
    label: string
    value: number
    dropped?: boolean | undefined
}

export const Roll = ({ label, value, dropped }: RollProps) => {
    const droppedDefined = dropped ?? false
    //TODO dropped will de-emphasise the dice roll to show it did not contribute to the final score
    return <div><span>{value}</span><span>{label}</span></div>
}

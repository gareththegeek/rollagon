import React from 'react'

export interface RollProps {
    label: string
    value: number
}

export const Roll = ({ label, value}: RollProps) => {
    return <div><span>{value}</span><span>{label}</span></div>
}

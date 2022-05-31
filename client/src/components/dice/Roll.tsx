import React from 'react'
import { H4 } from '../H4'

export interface RollProps {
    label: string
    value: number
    dropped?: boolean | undefined
    className?: string | undefined
    colour?: string | undefined
    title?: string | undefined
}

export const Roll = ({ label, value, dropped, className, colour, title }: RollProps) => {
    const droppedDefined = dropped ?? false
    const colourFinal = droppedDefined ? 'text-grey-500 border-transparent' : colour

    return (
        <div className={`text-center flex items-center flex-col ${className}`}>
            <div title={title}
                className={`flex justify-center content-center flex-col w-12 h-12 border-2 ${colourFinal}`}
            >
                <H4 className={`font-bold ${droppedDefined && 'text-grey-500'}`}>{value}</H4>
            </div>
            <div className={`${colourFinal} font-bold font-xs uppercase bg-transparent`}>{label}</div>
        </div>
    )
}

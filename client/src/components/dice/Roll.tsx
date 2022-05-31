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
        <div className={`text-center flex items-center flex-col w-10 ${className}`}>
            <div title={title}
                className={`w-8 h-8 mb-2 border-2 rotate-45 ${colourFinal}`}
            >
                <H4 className={`font-bold ${droppedDefined && 'text-grey-500'} -rotate-45 mt-0.5`}>{value}</H4>
            </div>
            <div className={`${colourFinal} font-bold text-xs uppercase bg-transparent`}>{label}</div>
        </div>
    )
}

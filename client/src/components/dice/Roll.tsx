import React from 'react'

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
                className={`flex justify-center content-center flex-col rounded-3xl w-12 h-12 border-2 ${colourFinal}`}
            >
                <div className={`text-xl ${droppedDefined && 'text-grey-500'}`}>{value}</div>
            </div>
            <div className={`${colourFinal} bg-transparent`}>{label}</div>
        </div>
    )
}

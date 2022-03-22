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
    const colourFinal = droppedDefined ? 'bg-stone-300' : colour

    return (
        <div className={`text-center ${className}`}>
            <div title={title}
                className={`flex justify-center content-center flex-col rounded-3xl w-12 h-12 ${colourFinal}`}
            >
                <div className="text-xl">{value}</div>
            </div>
            <div className="">{label}</div>
        </div>
    )
}

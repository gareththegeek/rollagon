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
    const colourFinal = droppedDefined ? 'text-teal border-transparent' : colour

    return (
        <div className={`text-center flex items-center flex-col w-12 ${!droppedDefined && 'my-2'} ${className ?? ''}`}>
            <div title={title} className={`w-8 h-8 border-2 rotate-45 ${colourFinal}`}>
                <div
                    className={`font-bold ${
                        droppedDefined && 'text-teal'
                    } -rotate-45 mt-0.5 mb-6 text-base leading-tight tracking-tight font-trajan font-bold uppercase lining-nums`}
                >
                    {value}
                </div>
            </div>
            <div className={`${colourFinal} font-bold text-xs uppercase bg-transparent leading-none mt-2`}>{label}</div>
        </div>
    )
}

import React from 'react'

export const SmallButton = ({ children, className, selected, disabled, ...rest }: any) => {
    const bg = selected ? 'bg-emerald-500' : ''
    const border = selected 
        ? 'border-emerald-500'
        : disabled 
            ? 'border-stone-300'
            : 'border-emerald-500'
    const hover = selected ? 'hover:bg-emerald-400 hover:border-emerald-400' : 'hover:bg-emerald-100'
    const text = selected ? 'text-white' : ''

    return (
        <button disabled={disabled} {...rest} className={(className ?? '') + ` mr-2 py-1 px-2 rounded border-2 ${bg} ${border} ${!disabled && hover} ${text}`}>
            {children}
        </button>
    )
}

import React from 'react'

export const SmallButton = ({ children, className, selected, disabled, ...rest }: any) => {
    const bg = selected ? 'bg-grey-300' : ''
    const border = selected 
        ? ''
        : disabled 
            ? 'border-grey-500 text-grey-500'
            : ''
    const hover = selected ? 'hover:bg-grey-200' : 'hover:bg-grey-300'
    //const text = selected ? 'text-white' : ''

    return (
        <button disabled={disabled} {...rest} className={(className ?? '') + ` font-extrabold text-sm uppercase mr-2 py-1 px-2 rounded border-2 ${bg} ${border} ${!disabled && hover}`}>
            {children}
        </button>
    )
}

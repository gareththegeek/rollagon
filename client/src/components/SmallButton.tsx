import React from 'react'

export const SmallButton = ({ children, collapseRight, className, selected, disabled, ...rest }: any) => {
    const bg = selected ? 'bg-grey-300' : ''
    const border = selected 
        ? ''
        : disabled 
            ? 'border-grey-500 text-grey-500'
            : ''
    const hover = selected ? 'hover:bg-grey-200' : 'hover:bg-grey-300'
    //const text = selected ? 'text-white' : ''

    return (
        <button disabled={disabled} {...rest} className={`${className ?? ''} ${collapseRight ? '' : 'mr-3'} font-extrabold leading-none text-sm uppercase py-2 px-5 border-2 lining-nums ${bg} ${border} ${!disabled && hover}`}>
            {children}
        </button>
    )
}

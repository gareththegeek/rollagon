import React from 'react'

export const Button = ({ children, className, highlight, disabled, ...rest }: any) => {
    const style = disabled
        ? 'border-grey-500 text-grey-500'
        : highlight
            ? 'bg-grey-300 hover:bg-grey-200'
            : 'hover:bg-grey-300'
    return (
        <button
            disabled={disabled}
            {...rest}
            className={`${className ?? ''} font-extrabold text-lg uppercase border-2 px-8 py-1 max-h-10 rounded ${style}`}
        >
            {children}
        </button>
    )
}

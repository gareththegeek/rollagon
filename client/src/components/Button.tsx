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
            className={`${className ?? ''} font-extrabold tracking-tight text-sm uppercase border-2 p-4 ${style}`}
        >
            {children}
        </button>
    )
}

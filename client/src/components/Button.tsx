import React from 'react'

export const Button = ({ children, className, disabled, ...rest }: any) => {
    const style = disabled
        ? 'border-grey-500 text-grey-500'
        : 'bg-grey-300 hover:bg-grey-200'
    return (
        <button
            disabled={disabled}
            {...rest}
            className={`mb-6 ${className ?? ''} px-6 font-extrabold tracking-tight text-sm uppercase border-2 ${style}`}
        >
            {children}
        </button>
    )
}

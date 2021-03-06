import React from 'react'

export const Button = ({ children, padding, className, disabled, primary, ...rest }: any) => {
    const style = disabled
        ? 'border-grey-500 text-grey-500'
        : (primary ?? true) ?
            'bg-grey-300 hover:bg-grey-200'
            : ''
    return (
        <button
            disabled={disabled}
            {...rest}
            className={`${padding ?? 'px-6 py-0.5'} ${className ?? ''} font-extrabold font-calluna tracking-tight text-sm uppercase border-2 lining-nums ${style}`}
        >
            {children}
        </button>
    )
}

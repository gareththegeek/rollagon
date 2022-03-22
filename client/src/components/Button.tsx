import React from 'react'

export const Button = ({ children, className, highlight, ...rest }: any) => {
    const style = highlight
        ? 'bg-orange-600 border-orange-600 hover:bg-orange-500 text-white'
        : 'border-emerald-500 hover:bg-emerald-200'
    return (
        <button {...rest} className={`${className ?? ''} border-2 px-8 py-1 max-h-10 rounded ${style}`}>
            {children}
        </button>
    )
}

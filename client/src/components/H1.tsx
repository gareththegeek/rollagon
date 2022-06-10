import React from 'react'

export const H1 = ({ children, className, ...rest }: any) => (
    <h1 {...rest} className={(className ?? '') + ' border-b-2 py-4 mb-4 text-4xl leading-tight tracking-tight font-trajan font-semibold uppercase lining-nums'}>
        {children}
    </h1>
)

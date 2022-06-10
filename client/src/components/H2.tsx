import React from 'react'

export const H2 = ({ children, className, ...rest }: any) => (
    <h2 {...rest} className={(className ?? '') + ' border-b-2 py-2 mb-4 text-2xl leading-tight tracking-tight font-trajan uppercase lining-nums'}>
        {children}
    </h2>
)

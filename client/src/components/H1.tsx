import React from 'react'

export const H1 = ({ children, className, ...rest }: any) => (
    <h1 {...rest} className={(className ?? '') + ' border-b-2 py-5 mb-4 text-6xl font-trajan font-semibold uppercase'}>
        {children}
    </h1>
)

import React from 'react'

export const H1 = ({ children, className, ...rest }: any) => (
    <h1 {...rest} className={(className ?? '') + ' mt-12 mb-8 text-6xl font-trajan font-semibold uppercase'}>
        {children}
    </h1>
)

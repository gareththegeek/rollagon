import React from 'react'

export const H3 = ({ children, className, ...rest }: any) => (
    <h3 {...rest} className={(className ?? '') + ' mt-12 mb-4 py-2 border-b-2 text-3xl font-trajan font-semibold uppercase'}>
        {children}
    </h3>
)

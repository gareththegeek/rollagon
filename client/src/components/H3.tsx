import React from 'react'

export const H3 = ({ children, className, ...rest }: any) => (
    <h3 {...rest} className={(className ?? '') + ' className="mt-12 mb-6 text-2xl font-trajan font-semibold uppercase'}>
        {children}
    </h3>
)

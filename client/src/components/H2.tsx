import React from 'react'

export const H2 = ({ children, className, ...rest }: any) => (
    <h2 {...rest} className={(className ?? '') + ' className="mt-12 mb-6 text-4xl font-trajan uppercase'}>
        {children}
    </h2>
)

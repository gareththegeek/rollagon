import React from 'react'

export const H4 = ({ children, className, ...rest }: any) => (
    <h4 {...rest} className={(className ?? '') + ' mb-6 text-base leading-tight tracking-tight font-trajan font-bold uppercase'}>
        {children}
    </h4>
)

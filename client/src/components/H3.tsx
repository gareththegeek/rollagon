import React from 'react'

export const H3 = ({ children, className, ...rest }: any) => (
    <h3 {...rest} className={(className ?? '') + ' border-b-2 mt-10 mb-4 pb-3 text-xl leading-tight tracking-tight font-trajan font-semibold uppercase'}>
        {children}
    </h3>
)

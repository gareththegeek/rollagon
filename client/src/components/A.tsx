import React from 'react'

export const A = ({ children, className, ...rest }: any) => (
    <a {...rest} className={(className ?? '') + ' text-teal underline'} target="_new">
        {children}
    </a>
)

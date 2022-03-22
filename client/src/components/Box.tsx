import React from 'react'

export const Box = ({ children, className, ...rest }: any) => (
    <div {...rest} className={(className ?? '') + ' rounded border-2 text-left p-4 m-4'}>
        {children}
    </div>
)

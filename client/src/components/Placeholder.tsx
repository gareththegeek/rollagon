import React from 'react'

export const Placeholder = ({ children, className, ...rest }: any) => (
    <div {...rest} className={(className ?? '') + ' px-6 py-1 border-2 border-dashed border-grey text-teal font-calluna uppercase tracking-tight text-sm font-extrabold'}>
        {children}
    </div>
)

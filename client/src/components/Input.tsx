import React from 'react'

export const Input = ({ children, className, ...rest }: any) => (
    <input {...rest} className={(className ?? '') + ' display-inline border-2 leading-7 px-2 mb-6'}>
        {children}
    </input>
)

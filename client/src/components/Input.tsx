import React from 'react'

export const Input = ({ children, className, ...rest }: any) => (
    <input {...rest} className={(className ?? '') + ' display-inline border-2 leading-7 rounded mr-2 px-1'}>
        {children}
    </input>
)

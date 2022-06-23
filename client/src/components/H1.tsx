import React from 'react'

export const H1 = ({ children, className, ...rest }: any) => (
    <h1
        {...rest}
        className={
            (className ?? '') +
            ` border-b-2
            mt-10 md:mt-0
            mb-4
            pb-3 md:pb-4 md:pt-4
            text-xl md:text-4xl
            leading-tight
            tracking-tight
            font-trajan
            font-semibold
            uppercase
            lining-nums`
        }
    >
        {children}
    </h1>
)

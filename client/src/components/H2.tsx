import React from 'react'

export const H2 = ({ children, className, ...rest }: any) => (
    <h2
        {...rest}
        className={
            (className ?? '') +
            ` border-b-2
            mt-10 md:mt-0
            mb-4
            pb-3 md:pb-2 md:pt-2
            text-xl md:text-2xl
            leading-tight
            tracking-tight
            font-trajan
            font-semibold md:font-normal
            uppercase
            lining-nums`
        }
    >
        {children}
    </h2>
)

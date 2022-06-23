import React from 'react'

export const H3 = ({ children, className, ...rest }: any) => (
    <h3
        {...rest}
        className={
            (className ?? '') +
            ` border-b-2
            mb-6 md:mt-10 md:mb-4
            pb-0 md:pb-3
            text-base md:text-xl
            font-bold md:font-semibold
            leading-tight
            tracking-tight
            font-trajan
            uppercase
            lining-nums
            text-teal`
        }
    >
        {children}
    </h3>
)

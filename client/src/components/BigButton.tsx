import React from 'react'
import { Button } from './Button'
import { Diamond } from './Diamond'
import { Divider } from './Divider'

export const BigButton = ({ className, children, ...rest }: any) => {
    return (
        <Button className={`${className} flex w-full mb-6`} {...rest}>
            <Diamond width={24} height={24} />
            <Divider />
            <div className="px-2 -mt-1">{children}</div>
            <Divider />
            <Diamond width={24} height={24} />
        </Button>
    )
}

import React from 'react'
import { H4 } from './H4'

export interface FieldSetProps {
    className?: string | undefined
    title: string
    guidance?: string | React.ReactElement | undefined
}

export const FieldSet: React.FC<FieldSetProps> = ({ children, className, title, guidance, ...rest }) => (
    <div {...rest} className={(className ?? '') + ' mt-10 mb-6 border-2 border-grey'}>
        <H4 className="pt-3 pb-4 px-6 mb-0 bg-grey">{title}</H4>
        <div className="py-4 px-6">
            {children}
            {guidance !== undefined && <div className="border-t-2 border-grey mt-4 pt-3">{guidance}</div>}
        </div>
    </div>
)

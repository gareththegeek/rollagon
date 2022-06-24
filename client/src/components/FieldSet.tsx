import React from 'react'

export interface FieldSetProps {
    role?: string | undefined
    className?: string | undefined
    title: string
    guidance?: string | React.ReactElement | undefined
}

export const FieldSet: React.FC<FieldSetProps> = ({ children, className, title, guidance, ...rest }) => (
    <section {...rest} className={(className ?? '') + ' mt-10 mb-6 border-2 border-grey'}>
        <h4 className="pt-3 pb-4 px-3 md:px-6 mb-0 bg-grey">{title}</h4>
        <div className="py-4 px-3 md:px-6">
            {children}
            {guidance !== undefined && <aside className="border-t-2 border-grey mt-4 pt-3"><p>{guidance}</p></aside>}
        </div>
    </section>
)

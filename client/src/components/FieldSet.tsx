import React from 'react'

export interface FieldSetProps {
    role?: string | undefined
    className?: string | undefined
    title: string
    guidance?: string | React.ReactElement | undefined
}

export const FieldSet: React.FC<FieldSetProps> = ({ children, className, title, guidance, ...rest }) => {
    const isString = typeof guidance === 'string'

    return (
        <section {...rest} className={(className ?? '') + ' border-2 border-grey gap-0'}>
            <h4 className="bg-grey p-2 md:px-6 md:py-3">{title}</h4>
            <div className="flex flex-col gap-4 py-4 px-3 md:px-6">
                {children}
                {guidance !== undefined && (
                    <aside className="border-t-2 border-grey pt-4">{isString ? <p>{guidance}</p> : guidance}</aside>
                )}
            </div>
        </section>
    )
}

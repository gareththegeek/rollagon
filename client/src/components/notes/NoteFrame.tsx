import React from 'react'

export const NoteFrame = ({ className, children }: any) => (
    <div className={`${className ?? ''} bg-grey-200 border-2 border-grey-200 m-2 p-2 rounded`}>{children}</div>
)

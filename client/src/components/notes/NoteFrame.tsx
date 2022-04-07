import React from 'react'

export const NoteFrame = ({ className, children }: any) => (
    <div className={`${className ?? ''} bg-stone-100 border-2 border-stone-200 m-2 p-2 rounded`}>{children}</div>
)

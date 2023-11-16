import React, { FC } from 'react'

export interface DividerProps {
    fullWidth?: boolean
    down?: boolean
}

export const Divider: FC<DividerProps> = ({ fullWidth, down }) => (
    <div className={`${fullWidth ? 'w-full' : 'flex-grow'}`}>
        <div className="border-b-2 mt-3" />
    </div>
)

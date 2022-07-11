import React, { FC } from 'react'

export interface DividerProps {
    fullWidth?: boolean | undefined
}

export const Divider: FC<DividerProps> = ({ fullWidth }) => (
    <div className={`${fullWidth ? 'w-full' : 'flex-grow'} mt-3 border-b-2`} />
)

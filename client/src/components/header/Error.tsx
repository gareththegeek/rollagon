import React from 'react'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { dismissError } from '../../slices/statusSlice'

const dismissHandler = (dispatch: AppDispatch, error: ErrorMessage) => () => {
    dispatch(dismissError(error.timestamp))
}

interface ErrorMessage {
    timestamp: string
    message: string | string[]
}

export interface ErrorProps {
    error: ErrorMessage
}

export const Error = ({ error }: ErrorProps) => {
    const dispatch = useAppDispatch()
    return (
        <div className="flex justify-between">
            <div>{Array.isArray(error.message) ? error.message.join(', ') : error.message}</div>
            <button onClick={dismissHandler(dispatch, error)} className="border-2 rounded px-2" title="Dismiss">X</button>
        </div>
    )
}

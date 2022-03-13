import React from 'react'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { dismissError } from '../../slices/statusSlice'

const dismissHandler = (dispatch: AppDispatch, error: ErrorMessage) =>
    () => {
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
    return <div>
        <button onClick={dismissHandler(dispatch, error)}>Dismiss</button>
        <span>{
            Array.isArray(error.message)
                ? error.message.join(', ')
                : error.message}
        </span>
    </div>
}

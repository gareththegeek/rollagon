import React from 'react'
import { useCustomTranslation } from '../../app/useCustomTranslation'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { dismissError } from '../../slices/statusSlice'

const dismissHandler = (dispatch: AppDispatch, error: ErrorMessage) => () => {
    dispatch(dismissError(error.timestamp))
}

interface ErrorMessage {
    timestamp?: string
    message: string | string[]
}

export interface ErrorProps {
    error: ErrorMessage
}

const messageToString = (t: (key: string) => string, messages: string[] | string) =>
    Array.isArray(messages)
        ? messages.map((x) => t(x)).join(', ')
        : t(messages)

export const Error = ({ error }: ErrorProps) => {
    const { t } = useCustomTranslation()
    const dispatch = useAppDispatch()
    return (
        <div className="flex justify-between">
            <div>{messageToString(t, error.message)}</div>
            <button onClick={dismissHandler(dispatch, error)} className="border-2 px-2" title="Dismiss">
                X
            </button>
        </div>
    )
}

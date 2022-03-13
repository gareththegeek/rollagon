import React from 'react'
import { useSelector } from 'react-redux'
import { selectErrors, selectIsLoading } from '../../slices/statusSlice'
import { Error } from './Error'

export const Status = () => {
    const isLoading = useSelector(selectIsLoading)
    const errors = useSelector(selectErrors)

    return <>
        {isLoading && <span>Loading...</span>}
        <ul>
            {errors.map(err => <li key={`error-${err.timestamp}`}><Error error={err} /></li>)}
        </ul>
    </>
}

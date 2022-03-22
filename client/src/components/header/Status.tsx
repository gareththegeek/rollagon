import React from 'react'
import { useSelector } from 'react-redux'
import { selectErrors, selectIsLoading } from '../../slices/statusSlice'
import { Error } from './Error'

export const Status = () => {
    const isLoading = useSelector(selectIsLoading)
    const errors = useSelector(selectErrors)

    return <>
        <img src="/images/agon.png" alt="Agon" className={isLoading ? 'animate-spin w-9 p-1' : 'w-9 p-1'} />
        <ul>
            {errors.map(err => <li key={`error-${err.timestamp}`}><Error error={err} /></li>)}
        </ul>
    </>
}

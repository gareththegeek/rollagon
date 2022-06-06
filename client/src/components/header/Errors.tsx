import React from 'react'
import { useSelector } from 'react-redux'
import { selectErrors } from '../../slices/statusSlice'
import { Error } from './Error'

export const Errors = () => {
    const errors = useSelector(selectErrors)

    if (errors.length === 0) {
        return <></>
    }

    return (
        <ul className="w-100 bg-grey-200 m-4 p-8">
            {errors.map((err) => (
                <li key={`error-${err.timestamp}`}>
                    <Error error={err} />
                </li>
            ))}
        </ul>
    )
}

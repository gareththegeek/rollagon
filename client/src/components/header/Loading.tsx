import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsLoading } from '../../slices/statusSlice'

export const Loading = () => {
    const isLoading = useSelector(selectIsLoading)

    return <img src="/images/agon.svg" alt="Agon" className={isLoading ? 'animate-spin w-9 h-12 p-1' : 'w-9 h-12 p-1'} />
}

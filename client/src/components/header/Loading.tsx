import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsLoading } from '../../slices/statusSlice'

export const Loading = () => {
    const isLoading = useSelector(selectIsLoading)

    return <img src="/images/agon.svg" alt="" className={`${isLoading && 'md:animate-spin '} mx-auto md:mx-0 w-9 h-12 p-1`} />
}

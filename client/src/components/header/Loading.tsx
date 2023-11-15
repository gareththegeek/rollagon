import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsLoading } from '../../slices/statusSlice'
import ThemeImage from '../ThemeImage'

export const Loading = () => {
    const isLoading = useSelector(selectIsLoading)

    return (
        <ThemeImage
            image="logoSmall"
            alt=""
            className={`${isLoading && 'md:animate-spin '} mx-auto md:mx-0 w-9 h-12 p-1`}
        />
    )
}

import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsConnected } from '../../slices/statusSlice'

export const Connection = () => {
    const connected = useSelector(selectIsConnected)
    if (connected) {
        return <></>
    }

    return (
        <div className="w-100 bg-red-300 m-4 p-8 rounded">
            There is a problem with your connection, attempting to reconnect. Please wait...
        </div>
    )
}

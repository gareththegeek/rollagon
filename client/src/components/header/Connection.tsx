import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { selectIsConnected } from '../../slices/statusSlice'

export const Connection = () => {
    const connected = useSelector(selectIsConnected)
    const location = useLocation()
    const { t } = useTranslation()

    if (location.pathname !== '/game') {
        return <></>
    }

    if (connected) {
        return <></>
    }

    return (
        <div className="w-100 m-4 p-8">
            {t('There is a problem with your connection, attempting to reconnect. Please wait...')}
        </div>
    )
}

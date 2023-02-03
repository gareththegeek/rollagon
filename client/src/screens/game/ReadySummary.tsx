import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectReadyContestantCount } from '../../slices/contestantSlice'

export const ReadySummary = () => {
    const { t } = useTranslation()
    const { ready, total } = useSelector(selectReadyContestantCount)
    return (
        <div>
            {ready}/{total} {t('Ready')}
        </div>
    )
}

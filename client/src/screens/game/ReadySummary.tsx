import React from 'react'
import { useCustomTranslation } from '../../app/useCustomTranslation'
import { useSelector } from 'react-redux'
import { selectReadyContestantCount } from '../../slices/contestantSlice'

export const ReadySummary = () => {
    const { t } = useCustomTranslation()
    const { ready, total } = useSelector(selectReadyContestantCount)
    return (
        <div>
            {ready}/{total} {t('Ready')}
        </div>
    )
}

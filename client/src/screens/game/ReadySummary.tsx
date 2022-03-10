import React from 'react'
import { useSelector } from 'react-redux'
import { selectReadyContestantCount } from '../../slices/contestantSlice'

export const ReadySummary = () => {
    const { ready, total } = useSelector(selectReadyContestantCount)
    return <div>{ready}/{total} Ready</div>
}

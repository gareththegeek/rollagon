import React from 'react'
import { useSelector } from 'react-redux'
import { selectContestants } from '../../slices/contestantSlice'
import { ContestantResult } from './ContestantResult'

export const ContestResult = () => {
    const contestants = useSelector(selectContestants)

    return <>
        {contestants.map(x => <ContestantResult key={`result-${x.playerId}`} contestant={x} />)}
    </>
}

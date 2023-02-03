import React from 'react'
import { useSelector } from 'react-redux'
import { selectContestants } from '../../slices/contestantSlice'
import { ContestantResult } from './ContestantResult'
import { BigButton } from '../../components/BigButton'
import { createContestAsync } from '../../slices/contestSlice'
import { AppDispatch } from '../../app/store'
import { selectIsStrifePlayer } from '../../slices/playerSlice'
import { useAppDispatch } from '../../app/hooks'
import { selectGameId } from '../../slices/gameSlice'
import { useTranslation } from 'react-i18next'

const createContestHandler = (dispatch: AppDispatch, gameId: string) => () => {
    dispatch(createContestAsync(gameId))
}

export const ContestResult = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const gameId = useSelector(selectGameId)
    const contestants = useSelector(selectContestants)
    const isStrifePlayer = useSelector(selectIsStrifePlayer)

    if (gameId === undefined) {
        return <></>
    }

    return (
        <>
            {contestants.map((x) => (
                <ContestantResult key={`result-${x.playerId}`} contestant={x} />
            ))}
            {isStrifePlayer && (
                <BigButton onClick={createContestHandler(dispatch, gameId)}>{t('New Contest')}</BigButton>
            )}
        </>
    )
}

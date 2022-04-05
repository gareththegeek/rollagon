import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { setNameDieAsync } from '../../slices/contestantSlice'
import { selectContestId } from '../../slices/contestSlice'
import { selectGameId } from '../../slices/gameSlice'
import { SmallButton } from '../SmallButton'

export interface NameDieSelectorProps {
    contestant: Contestant
    onClick: () => void
}

const dice = [6, 8, 10, 12]

const nameDieRollHandler =
    (
        onClick: () => void,
        dispatch: AppDispatch,
        gameId: string,
        contestId: string,
        contestant: Contestant,
        value: number
    ) =>
    () => {
        dispatch(setNameDieAsync({ gameId, contestId, contestant, value }))
        onClick()
    }

export const NameDiceSelector = ({ contestant, onClick }: NameDieSelectorProps) => {
    const dispatch = useAppDispatch()
    const gameId = useSelector(selectGameId)
    const contestId = useSelector(selectContestId)

    if (gameId === undefined || contestId === undefined) {
        return <></>
    }

    return (
        <>
            {dice.map((value) => (
                <SmallButton
                    onClick={nameDieRollHandler(onClick, dispatch, gameId, contestId, contestant, value)}
                    key={`name-dice-selector-${contestant.playerId}-${value}`}
                >{`d${value}`}</SmallButton>
            ))}
        </>
    )
}

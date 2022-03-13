import React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { selectReadyContestantCount } from '../../slices/contestantSlice'
import { rollContestResultAsync, selectContestId } from '../../slices/contestSlice'
import { selectGameId } from '../../slices/gameSlice'
import { selectIsStrifePlayer, selectPlayers } from '../../slices/playerSlice'
import { selectIsLoading } from '../../slices/statusSlice'
import { EditContestant } from './EditContestant'
import { ReadySummary } from './ReadySummary'

const rollResultsHandler = (dispatch: AppDispatch, gameId: string, contestId: string) => () => {
    dispatch(rollContestResultAsync({ gameId, contestId }))
}

export const EnterContest = () => {
    const dispatch = useAppDispatch()
    const isLoading = useSelector(selectIsLoading)
    const isStifePlayer = useSelector(selectIsStrifePlayer)
    const gameId = useSelector(selectGameId)
    const contestId = useSelector(selectContestId)
    const players = useSelector(selectPlayers)
    const { all } = useSelector(selectReadyContestantCount)

    if (gameId === undefined || contestId === undefined) {
        return <></>
    }

    return (
        <div>
            <h2>Enter the Contest</h2>
            {players.map((playa) => (
                <EditContestant key={`enter-contest-player-${playa.id}`} player={playa} />
            ))}
            <ReadySummary />
            {isStifePlayer && (
                <button disabled={isLoading || !all} onClick={rollResultsHandler(dispatch, gameId, contestId)}>
                    Roll Player Results
                </button>
            )}
        </div>
    )
}

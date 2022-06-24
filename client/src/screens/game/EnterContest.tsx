import React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { BigButton } from '../../components/BigButton'
import { Placeholder } from '../../components/Placeholder'
import { selectContestants, selectReadyContestantCount } from '../../slices/contestantSlice'
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
    const isStrifePlayer = useSelector(selectIsStrifePlayer)
    const gameId = useSelector(selectGameId)
    const contestId = useSelector(selectContestId)
    const players = useSelector(selectPlayers)
    const { all } = useSelector(selectReadyContestantCount)
    const contestants = useSelector(selectContestants)

    if (gameId === undefined || contestId === undefined) {
        return <></>
    }

    return (
        <section>
            <h3>Who Will Join the Contest?</h3>
            <p className="mb-6">Heroes join the contest by building their dice pool. Make sure everyone is ready before rolling the final results!</p>
            {contestants.length === 0 && isStrifePlayer
                && <Placeholder className="mb-2">No one has joined</Placeholder>}
            {players.map((playa) => (
                <EditContestant key={`enter-contest-player-${playa.id}`} player={playa} />
            ))}
            {contestants.length > 0 && <ReadySummary />}
            {isStrifePlayer && (
                <BigButton
                    disabled={isLoading || !all}
                    onClick={rollResultsHandler(dispatch, gameId, contestId)}
                    className="mt-8"
                >
                    Roll Results
                </BigButton>
            )}
        </section>
    )
}

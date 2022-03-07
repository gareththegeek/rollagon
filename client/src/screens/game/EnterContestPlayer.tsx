import React from 'react'
import { useSelector } from 'react-redux'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { joinContestAsync, selectContestant, selectContestId } from '../../slices/contestSlice'
import { selectGameId } from '../../slices/gameSlice'

const joinContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string, playerId: string) =>
    () => {
        dispatch(joinContestAsync({ gameId, contestId, playerId }))
    }

export interface EnterContestPlayerProps {
    player: Player
}

export const EnterContestPlayer = ({ player }: EnterContestPlayerProps) => {
    const dispatch = useAppDispatch()
    const gameId = useSelector(selectGameId)
    const contestId = useSelector(selectContestId)
    const contestant = useSelector(selectContestant(player.id!))

    if (gameId === undefined || contestId === undefined) {
        return <></>
    }

    if (contestant === undefined) {
        return <button onClick={joinContestHandler(dispatch, gameId, contestId, player.id!)}>
            Join the Contest!
        </button>
    }

    return <></>
}

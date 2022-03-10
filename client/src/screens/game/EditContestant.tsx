import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contests'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { DicePoolEditor } from '../../components/dice/DicePoolEditor'
import { ToggleButton } from '../../components/ToggleButton'
import { diceChangeAsync, joinContestAsync, selectContestant, setReadyAsync } from '../../slices/contestantSlice'
import { selectContestId } from '../../slices/contestSlice'
import { selectGameId } from '../../slices/gameSlice'
import { selectPlayerId } from '../../slices/playerSlice'

const joinContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string, playerId: string) => () => {
    dispatch(joinContestAsync({ gameId, contestId, playerId }))
}

const readyHandler =
    (dispatch: AppDispatch, gameId: string, contestId: string, contestant: Contestant) => (ready: boolean) => {
        dispatch(setReadyAsync({ gameId, contestId, contestant, ready }))
    }

const editDiceHandler =
    (dispatch: AppDispatch, gameId: string, contestId: string, contestant: Contestant) =>
    (type: string, quantity: number) => {
        dispatch(diceChangeAsync({ gameId, contestId, contestant, type, quantity }))
    }

export interface EditContestantProps {
    player: Player
}

export const EditContestant = ({ player }: EditContestantProps) => {
    const dispatch = useAppDispatch()
    const gameId = useSelector(selectGameId)
    const contestId = useSelector(selectContestId)
    const playerId = useSelector(selectPlayerId)
    const contestant = useSelector(selectContestant(player.id!))
    const isCurrentPlayer = playerId === player.id

    if (gameId === undefined || contestId === undefined) {
        return <></>
    }

    if (contestant === undefined) {
        if (isCurrentPlayer) {
            return (
                <button onClick={joinContestHandler(dispatch, gameId, contestId, player.id!)}>Join the Contest!</button>
            )
        } else {
            return <></>
        }
    }

    return (
        <>
            <DicePoolEditor
                enabled={isCurrentPlayer}
                dice={[4, 6, 8, 10, 12]}
                onChange={editDiceHandler(dispatch, gameId, contestId, contestant)}
            />
            <div>|</div>
            <ToggleButton
                enabled={isCurrentPlayer}
                label="Ready"
                onChange={readyHandler(dispatch, gameId, contestId, contestant)}
            />
        </>
    )
}

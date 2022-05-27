import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Button } from '../../components/Button'
import { DicePoolEditor } from '../../components/dice/DicePoolEditor'
import { H4 } from '../../components/H4'
import { SmallButton } from '../../components/SmallButton'
import { ToggleButton } from '../../components/ToggleButton'
import {
    diceChangeAsync,
    joinContestAsync,
    leaveContestAsync,
    selectContestant,
    setReadyAsync
} from '../../slices/contestantSlice'
import { selectContestId } from '../../slices/contestSlice'
import { selectGameId } from '../../slices/gameSlice'
import { selectPlayerId } from '../../slices/playerSlice'

const joinContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string, playerId: string) => () => {
    dispatch(joinContestAsync({ gameId, contestId, playerId }))
}

const leaveContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string, playerId: string) => () => {
    dispatch(leaveContestAsync({ gameId, contestId, playerId }))
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
                <div className="mb-4">
                    <H4 className="mb-2">{player.name}</H4>
                    <Button highlight={true} onClick={joinContestHandler(dispatch, gameId, contestId, player.id!)}>
                        Join the Contest!
                    </Button>
                </div>
            )
        } else {
            return <></>
        }
    }

    return (
        <div className="mb-4">
            <H4 className="mb-2">{player.name}</H4>
            <div className="flex">
                <DicePoolEditor
                    enabled={isCurrentPlayer}
                    dicePool={contestant.dicePool}
                    dice={[4, 6, 8, 10, 12]}
                    onChange={editDiceHandler(dispatch, gameId, contestId, contestant)}
                />
                <ToggleButton
                    enabled={isCurrentPlayer}
                    toggled={contestant.ready}
                    label="Ready"
                    onChange={readyHandler(dispatch, gameId, contestId, contestant)}
                />
                {isCurrentPlayer && (
                    <SmallButton onClick={leaveContestHandler(dispatch, gameId, contestId, player.id!)}>
                        Leave
                    </SmallButton>
                )}
            </div>
        </div>
    )
}

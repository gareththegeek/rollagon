import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Button } from '../../components/Button'
import { DicePoolEditor } from '../../components/dice/DicePoolEditor'
import { FieldSet } from '../../components/FieldSet'
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
                <FieldSet
                    title={player.name}
                    guidance="Each Hero Player indicates their participation in the contest by speaking their name. Start with the leader and go around the table. On your turn, recite your hero's name and add dice as you go: If your Epithet applies to the contest, add that die. Add your Name die and the Domain die for the contest when you say your Name and lineage."
                    className="mb-4"
                >
                    <Button highlight={true} onClick={joinContestHandler(dispatch, gameId, contestId, player.id!)}>
                        Join the Contest!
                    </Button>
                </FieldSet>
            )
        } else {
            return <></>
        }
    }

    return (
        <FieldSet
            title={player.name}
            guidance={isCurrentPlayer ? "Each Hero Player indicates their participation in the contest by speaking their name. Start with the leader and go around the table. On your turn, recite your hero's name and add dice as you go: If your Epithet applies to the contest, add that die. Add your Name die and the Domain die for the contest when you say your Name and lineage." : undefined}
            className="mb-4"
        >
            <div className="flex flex-row flex-wrap">
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
                    className="my-4"
                    onChange={readyHandler(dispatch, gameId, contestId, contestant)}
                />
                {isCurrentPlayer && (
                    <SmallButton
                        className="my-4"
                        onClick={leaveContestHandler(dispatch, gameId, contestId, player.id!)}
                    >
                        Leave
                    </SmallButton>
                )}
            </div>
        </FieldSet>
    )
}

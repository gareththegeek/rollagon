import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { selectRollingNameDie } from '../../slices/contestantSlice'
import { selectPlayerId } from '../../slices/playerSlice'
import { Button } from '../Button'
import { FieldSet } from '../FieldSet'
import { Placeholder } from '../Placeholder'
import { SmallButton } from '../SmallButton'
import { NameDiceSelector } from './NameDiceSelector'

export interface NameDieProps {
    contestant: Contestant
}

export const NameDie = ({ contestant }: NameDieProps) => {
    const rolling = useSelector(selectRollingNameDie)
    const playerId = useSelector(selectPlayerId)
    const isCurrentPlayer = playerId === contestant.playerId
    const isCurrentPlayerRolling = isCurrentPlayer && rolling

    const [showDiceSelector, setShowDiceSelector] = useState(false)

    const nameDie = contestant.dicePool.nameDie

    return (
        <div className="flex mt-4">
            {showDiceSelector ? (
                <FieldSet title="Select Name Die"
                    className='-ml-4 mb-0 mt-2' role="radiogroup" aria-label="Name Dice">
                    <NameDiceSelector
                        contestant={contestant}
                        onClick={() => {
                            setShowDiceSelector(false)
                        }}
                    />
                    <SmallButton
                        onClick={() => {
                            setShowDiceSelector(false)
                        }}
                        title="Cancel Tie Break Roll"
                    >
                        Cancel
                    </SmallButton>
                </FieldSet>
            ) : (
                <>
                    {isCurrentPlayerRolling && <Placeholder className="animate-pulse anim">Rolling Name Die...</Placeholder>}
                    {isCurrentPlayer && !rolling && (
                        <Button
                            className="mt-2"
                            onClick={() => {
                                setShowDiceSelector(true)
                            }}
                        >
                            {nameDie ? 'Roll Again' : 'Break Tie'}
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}

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
        <div className="flex">
            {showDiceSelector ? (
                <FieldSet title="Select Name Die" className="-ml-4 mb-0 mt-2 w-full" role="radiogroup" aria-label="Name Dice">
                    <div className="flex flex-col md:flex-row gap-3">
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
                    </div>
                </FieldSet>
            ) : (
                <>
                    {isCurrentPlayerRolling && (
                        <Placeholder className="animate-pulse anim w-full md:w-auto">Rolling Name Die...</Placeholder>
                    )}
                    {isCurrentPlayer && !rolling && (
                        <Button
                            className="w-full md:w-auto"
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

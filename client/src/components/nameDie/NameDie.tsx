import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { selectRollingNameDie } from '../../slices/contestantSlice'
import { selectPlayerId } from '../../slices/playerSlice'
import { Button } from '../Button'
import { Roll } from '../dice/Roll'
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
                <div>
                    <h3>Select Name Die:</h3>
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
            ) : (
                <>
                    {isCurrentPlayerRolling && <div className="animate-pulse anim">Rolling Name Die...</div>}
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
                    {nameDie && !isCurrentPlayerRolling && (
                        <Roll
                            value={nameDie.roll!}
                            label="Name Die"
                            colour="bg-grey-300 border-black"
                            title="This is the tie breaking roll"
                            className="ml-4"
                        />
                    )}
                </>
            )}
        </div>
    )
}

import React, { useState } from 'react'
import { useCustomTranslation } from '../../app/useCustomTranslation'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { selectContestants, selectRollingNameDie } from '../../slices/contestantSlice'
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
    const { t } = useCustomTranslation()
    const rolling = useSelector(selectRollingNameDie)
    const playerId = useSelector(selectPlayerId)
    const isCurrentPlayer = playerId === contestant.playerId
    const isCurrentPlayerRolling = isCurrentPlayer && rolling
    const isTied = Object.values(useSelector(selectContestants)).some(
        (c) => c.dicePool.score === contestant.dicePool.score && c.playerId !== contestant.playerId
    )
    console.log(Object.values(useSelector(selectContestants)))
    console.log(isTied)

    const [showDiceSelector, setShowDiceSelector] = useState(false)

    const nameDie = contestant.dicePool.nameDie

    if (!isCurrentPlayer) {
        return <></>
    }

    return (
        <div className="flex">
            {showDiceSelector ? (
                <FieldSet
                    title={t('Select Name Die')}
                    className="-ml-4 mb-0 mt-2 w-full"
                    role="radiogroup"
                    aria-label={t('Name Dice')}
                >
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
                            title={t('Cancel Tie Break Roll')}
                        >
                            {t('Cancel')}
                        </SmallButton>
                    </div>
                </FieldSet>
            ) : (
                <>
                    {isCurrentPlayerRolling && (
                        <Placeholder className="animate-pulse anim w-full md:w-auto">{t('Rolling Name Die...')}</Placeholder>
                    )}
                    {isCurrentPlayer && !rolling && isTied && (
                        <Button
                            className="w-full md:w-auto"
                            onClick={() => {
                                setShowDiceSelector(true)
                            }}
                        >
                            {nameDie ? t('Roll Again') : t('Break Tie')}
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}

import React from 'react'
import { Contestant } from '../../api/contestants'
import { Roll } from './Roll'

export interface HeroRollResultProps {
    contestant: Contestant
}

export const HeroRollResult = ({ contestant }: HeroRollResultProps) => (
    <Roll
        value={contestant.dicePool.score!}
        label=""
        colour="bg-grey-300 border-black"
        title="This was the result of your roll"
    />
)

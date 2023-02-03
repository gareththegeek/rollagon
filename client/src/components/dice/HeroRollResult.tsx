import React from 'react'
import { useTranslation } from 'react-i18next'
import { Contestant } from '../../api/contestants'
import { Roll } from './Roll'

export interface HeroRollResultProps {
    contestant: Contestant
}

export const HeroRollResult = ({ contestant }: HeroRollResultProps) => {
    const { t } = useTranslation()
    return <Roll
        value={contestant.dicePool.score!}
        label=""
        colour="bg-grey-300 border-black"
        title={t('This was the result of your roll') ?? ""}
    />
}

import React from 'react'
import { Contestant } from '../../api/contests'
import { Roll } from './Roll'

export interface HeroRollProps {
    contestant: Contestant
}

export const HeroRoll = ({ contestant }: HeroRollProps) => {
    const best = contestant.dicePool.dice.filter((x) => x.type !== 'd4').slice(0, 2)
    const d4s = contestant.dicePool.dice.filter((x) => x.type === 'd4')
    const hasD4 = d4s.length > 0
    const d4 = hasD4 ? d4s[0] : undefined

    return (
        <div>
            <Roll value={contestant.dicePool.score!} label="Result" />
            <Roll value={best[0].roll!} label={best[0].type} /> + <Roll value={best[1].roll!} label={best[1].type} />
            {hasD4 ? <Roll value={d4!.roll!} label="Bonus" /> : <></>}
        </div>
    )
}

import React from 'react'
import { Contestant } from '../../api/contestants'
import { Roll } from './Roll'

export interface HeroRollProps {
    contestant: Contestant
}

export const HeroRoll = ({ contestant }: HeroRollProps) => {
    const [best0, best1, ...rest] = contestant.dicePool.dice.filter((x) => x.type !== 'd4')
    const d4s = contestant.dicePool.dice.filter((x) => x.type === 'd4')
    const hasD4 = d4s.length > 0
    const d4 = hasD4 ? d4s[0] : undefined
    const d4sDropped = d4s.length > 1 ? d4s.slice(1) : []

    return (
        <div>
            <Roll value={contestant.dicePool.score!} label="Result" />
            <Roll value={best0.roll!} label={best0.type} /> + <Roll value={best1.roll!} label={best1.type} />
            {hasD4 ? (
                <>
                    <span>+</span>
                    <Roll value={d4!.roll!} label="Bonus" />
                </>
            ) : (
                <></>
            )}
            {rest.length > 0 && (
                <>
                    (
                    {rest.map((x,i) => (
                        <Roll key={`dropped-${contestant.playerId}-${i}`} value={x.roll!} label={x.type} dropped={true} />
                    ))}
                    ) (
                    {d4sDropped.map((x,i) => (
                        <Roll key={`dropped-d4-${contestant.playerId}-${i}`} value={x.roll!} label={x.type} dropped={true} />
                    ))}
                    )
                </>
            )}
        </div>
    )
}

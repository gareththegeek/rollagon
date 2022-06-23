import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { selectRollingNameDie } from '../../slices/contestantSlice'
import { selectPlayerId } from '../../slices/playerSlice'
import { NameDie } from '../nameDie/NameDie'
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

    const rolling = useSelector(selectRollingNameDie)
    const playerId = useSelector(selectPlayerId)
    const isCurrentPlayer = playerId === contestant.playerId
    const isCurrentPlayerRolling = isCurrentPlayer && rolling

    const nameDie = contestant.dicePool.nameDie

    return (
        <ol className={`flex flex-col pl-4 mb-10`}>
            <div className="flex">
                {nameDie && !isCurrentPlayerRolling && (
                    <Roll
                        value={nameDie.roll!}
                        label="Tie Breaker"
                        colour="bg-grey-300 border-black"
                        title="This is the tie breaking roll"
                        className="mr-12"
                    />
                )}
                <Roll
                    value={contestant.dicePool.score!}
                    label="Result"
                    colour="bg-grey-300 border-black"
                    className="mr-12"
                    title="This was the result of your roll"
                />
                <Roll
                    value={best0.roll!}
                    label={best0.type}
                    colour="border-grey-300"
                    className="mr-3"
                    title="This dice contributed to the score"
                />
                <Roll
                    value={best1.roll!}
                    label={best1.type}
                    colour="border-grey-300"
                    className="mr-3"
                    title="This dice contributed to the score"
                />
                {hasD4 ? (
                    <>
                        <Roll
                            value={d4!.roll!}
                            label="Bonus"
                            colour="border-grey-300"
                            className="mr-3"
                            title="This dice contributed to the score"
                        />
                    </>
                ) : (
                    <></>
                )}
                {(rest.length > 0 || d4sDropped.length > 0) && (
                    <>
                        <div className="ml-8 pr-8 border-l-2 border-stone-500"></div>
                        {rest.map((x, i) => (
                            <Roll
                                key={`dropped-${contestant.playerId}-${i}`}
                                value={x.roll!}
                                label={x.type}
                                dropped={true}
                                className="mr-2"
                                title="This dice was dropped and did not contribute to the final score"
                            />
                        ))}
                        {d4sDropped.map((x, i) => (
                            <Roll
                                key={`dropped-d4-${contestant.playerId}-${i}`}
                                value={x.roll!}
                                label={x.type}
                                dropped={true}
                                className="mr-2"
                                title="This dice was dropped and did not contribute to the final score"
                            />
                        ))}
                    </>
                )}
            </div>
            <div>
                <NameDie contestant={contestant} />
            </div>
        </ol>
    )
}

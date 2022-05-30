import React from 'react'
import { Strife } from '../../api/strife'
import { Roll } from './Roll'

export interface StrifeRollProps {
    strife: Strife
}

export const StrifeRoll = ({ strife }: StrifeRollProps) => {
    const [best, ...rest] = strife.dicePool.dice
    return (
        <div className="flex">
            <Roll
                value={strife.targetNumber!}
                label="Target"
                colour="bg-grey-300 border-black"
                className="mr-16"
                title="This is the target number to beat in this contest"
            />
            <Roll
                value={strife.strifeLevel}
                label="Strife"
                colour="border-grey-300"
                title="This dice contributed to the score"
            />
            <Roll
                value={best.roll!}
                label={best.type}
                colour="border-grey-300"
                title="This dice contributed to the score"
            />
            <div className="ml-8 pr-8 border-l-2 border-stone-500"></div>
            {rest.length > 0 && (
                <>
                    {rest.map((x, idx) => (
                        <Roll
                            key={`strife-unused-${idx}`}
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
    )
}

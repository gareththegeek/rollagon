import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { HeroRoll } from '../../components/dice/HeroRoll'
import { HeroRollResult } from '../../components/dice/HeroRollResult'
import { selectPlayer } from '../../slices/playerSlice'

export interface ContestantResultProps {
    contestant: Contestant
}

export const ContestantResult = ({ contestant }: ContestantResultProps) => {
    const player = useSelector(selectPlayer(contestant.playerId))

    return (
        <section>
            <div className="flex items-center gap-3 border-t-2 pt-4">
                <HeroRollResult contestant={contestant} />
                <h4>
                    {player!.name}&nbsp;
                    {contestant.prevail ? 'Prevails' : 'Suffers'}
                </h4>
            </div>

            <HeroRoll contestant={contestant} />
        </section>
    )
}

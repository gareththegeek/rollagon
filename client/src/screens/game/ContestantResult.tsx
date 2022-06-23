import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { HeroRoll } from '../../components/dice/HeroRoll'
import { selectPlayer } from '../../slices/playerSlice'

export interface ContestantResultProps {
    contestant: Contestant
}

export const ContestantResult = ({ contestant }: ContestantResultProps) => {
    const player = useSelector(selectPlayer(contestant.playerId))

    return (
        <section>
            <h4 className="border-0 border-t-2 pt-4">
                {player!.name}&nbsp;
                {contestant.prevail ? 'Prevails' : 'Suffers'}
            </h4>

            <HeroRoll contestant={contestant} />
        </section>
    )
}

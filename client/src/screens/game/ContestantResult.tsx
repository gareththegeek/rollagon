import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contests'
import { HeroRoll } from '../../components/dice/HeroRoll'
import { Roll } from '../../components/dice/Roll'
import { selectPlayer } from '../../slices/playerSlice'

export interface ContestantResultProps {
    contestant: Contestant
}

export const ContestantResult = ({ contestant }: ContestantResultProps) => {
    const player = useSelector(selectPlayer(contestant.playerId))

    return (
        <div>
            <h2>{contestant.prevail ? 'Prevails' : 'Suffers'}</h2>
            <h3>{player!.name}</h3>
            <HeroRoll contestant={contestant} />
        </div>
    )
}

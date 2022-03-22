import React from 'react'
import { useSelector } from 'react-redux'
import { Contestant } from '../../api/contestants'
import { Box } from '../../components/Box'
import { HeroRoll } from '../../components/dice/HeroRoll'
import { selectPlayer } from '../../slices/playerSlice'

export interface ContestantResultProps {
    contestant: Contestant
}

export const ContestantResult = ({ contestant }: ContestantResultProps) => {
    const player = useSelector(selectPlayer(contestant.playerId))

    return (
        <Box>
            <h2 className="text-2xl mb-4">
                {player!.name}&nbsp;
                {contestant.prevail ? 'Prevails' : 'Suffers'}
            </h2>

            <HeroRoll contestant={contestant} />
        </Box>
    )
}

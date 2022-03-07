import React from 'react'
import { useSelector } from 'react-redux'
import { selectPlayers } from '../../slices/playerSlice'
import { EnterContestPlayer } from './EnterContestPlayer'

export const EnterContest = () => {
    const players = useSelector(selectPlayers)

    return <div>
        <h2>Enter the Contest</h2>
        {players.map(playa => <EnterContestPlayer key={`enter-contest-player-${playa.id}`} player={playa} />)}
    </div>
}

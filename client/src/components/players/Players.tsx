import React from 'react'
import { useSelector } from 'react-redux'
import { selectConnections, selectPlayers } from '../../slices/playerSlice'

export const Players = () => {
    const players = useSelector(selectPlayers)
    const connections = useSelector(selectConnections)

    const strifeConnected = connections.includes('strife')
    const strifeColour = strifeConnected ? 'bg-grey-300' : 'bg-transparent'

    return (
        <ul>
            <li>
                <div className={`${strifeColour} h-4 w-4 border-2 inline-block`} /> Strife Player
            </li>
            {players.map((player) => {
                const isConnected = connections.includes(player.id ?? '')
                const colour = isConnected ? 'bg-grey-300' : 'bg-transparent'
                return (
                    <li key={player.id}>
                        <div className={`${colour} h-4 w-4 border-2 inline-block`} /> {player.name}
                    </li>
                )
            })}
        </ul>
    )
}

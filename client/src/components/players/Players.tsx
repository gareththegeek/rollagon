import React from 'react'
import { useSelector } from 'react-redux'
import { selectConnections, selectPlayers } from '../../slices/playerSlice'

export const Players = () => {
    const players = useSelector(selectPlayers)
    const connections = useSelector(selectConnections)

    const strifeConnected = connections.includes('strife')
    const strifeColour = strifeConnected ? 'bg-grey-300' : 'bg-transparent'

    return (
        <ul className="flex flex-col items-center md:items-end">
            <li className="flex items-center">
                Strife Player
                <div className={`${strifeColour} h-4 w-4 border-2 rounded-lg ml-2 inline-block`} />
            </li>
            {players.map((player) => {
                const isConnected = connections.includes(player.id ?? '')
                const colour = isConnected ? 'bg-grey-300' : 'bg-transparent'
                return (
                    <li key={player.id} className="flex items-center">
                        {player.name}
                        <div className={`${colour} h-4 w-4 border-2 rounded-lg ml-2 inline-block`} />
                    </li>
                )
            })}
        </ul>
    )
}

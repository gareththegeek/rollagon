import { useSelector } from 'react-redux'
import { selectGameId } from '../../slices/gameSlice'
import { selectConnections, selectPlayers } from '../../slices/playerSlice'
import { Box } from '../Box'

export const Players = () => {
    const gameId = useSelector(selectGameId)
    const players = useSelector(selectPlayers)
    const connections = useSelector(selectConnections)

    const strifeConnected = connections.includes('strife')
    const strifeColour = strifeConnected ? 'bg-emerald-500' : 'bg-red-500'

    return (
        <Box>
            <div className="flex justify-between">
                <h2 className="text-lg">Players</h2>
                <a className="underline" href={`/join/${gameId}`}>
                    Invite Players with Link
                </a>
            </div>
            <ul>
                <li>
                    <div className={`${strifeColour} h-3 w-3 rounded-xl inline-block`} /> Strife Player
                </li>
                {players.map((player) => {
                    const isConnected = connections.includes(player.id ?? '')
                    const colour = isConnected ? 'bg-emerald-500' : 'bg-red-500'
                    return (
                        <li key={player.id}>
                            <div className={`${colour} h-3 w-3 rounded-xl inline-block`} /> {player.name}
                        </li>
                    )
                })}
            </ul>
        </Box>
    )
}

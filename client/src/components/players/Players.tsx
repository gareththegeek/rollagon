import { useSelector } from 'react-redux'
import { selectGameId } from '../../slices/gameSlice'
import { selectPlayers } from '../../slices/playerSlice'
import { Box } from '../Box'

export const Players = () => {
    const gameId = useSelector(selectGameId)
    const players = useSelector(selectPlayers)

    return (
        <Box>
            <div className="flex justify-between">
                <h2 className="text-lg">Players</h2>
                <a className="underline" href={`/join/${gameId}`}>
                    Invite Players with Link
                </a>
            </div>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>{player.name}</li>
                ))}
            </ul>
        </Box>
    )
}

import { useSelector } from 'react-redux'
import { Player } from '../../api/players'
import { selectGameId } from '../../slices/gameSlice'
import { selectPlayers } from '../../slices/playerSlice'

export const Players = ({ onClick }: { onClick?: (player: Player) => void }) => {
    const gameId = useSelector(selectGameId)
    const players = useSelector(selectPlayers)

    return <>
    <h2>Players</h2>
    <a href={`/join/${gameId}`}>Invite Players with Link</a>
    <ul>
        {players.map(player => <li key={player.id}><button onClick={() => {
            if (onClick === undefined) {
                return
            }
            onClick(player)
        }}>{player.name}</button></li>)}
    </ul>
    </>
}

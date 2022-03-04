import { useSelector } from 'react-redux'
import { Player } from '../api/players'
import { selectPlayers } from '../screens/lobby/playerSlice'

export const Players = ({ onClick }: { onClick: (player: Player) => void }) => {
    const players = useSelector(selectPlayers)

    return <ul>
        {players.map(player => <li key={player.id}><button onClick={() => onClick(player)}>{player.name}</button></li>)}
    </ul>
}

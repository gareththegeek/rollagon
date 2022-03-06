import { useSelector } from 'react-redux'
import { Player } from '../../api/players'
import { selectPlayers } from '../../slices/playerSlice'

export const Players = ({ onClick }: { onClick?: (player: Player) => void }) => {
    const players = useSelector(selectPlayers)

    return <>
    <h2>Players</h2>
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

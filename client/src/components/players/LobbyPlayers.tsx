import { useSelector } from 'react-redux'
import { Player } from '../../api/players'
import { selectPlayers } from '../../slices/playerSlice'
import { Button } from '../Button'

export const LobbyPlayers = ({ onClick }: { onClick?: (player: Player) => void }) => {
    const players = useSelector(selectPlayers)

    return <>
    <ul>
        {players.map(player => <li key={player.id}><Button className="my-2 w-full md:w-auto" onClick={() => {
            if (onClick === undefined) {
                return
            }
            onClick(player)
        }}>Join as {player.name}</Button></li>)}
    </ul>
    </>
}

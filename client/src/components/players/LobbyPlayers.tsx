import { useSelector } from 'react-redux'
import { Player } from '../../api/players'
import { selectPlayers } from '../../slices/playerSlice'
import { Button } from '../Button'

export const LobbyPlayers = ({ onClick, disabled }: { onClick?: (player: Player) => void, disabled?: boolean }) => {
    const players = useSelector(selectPlayers)

    return <>
    <ul>
        {players.map(player => <li key={player.id}><Button disabled={disabled} className="my-2 w-full md:w-auto" onClick={() => {
            if (onClick === undefined) {
                return
            }
            onClick(player)
        }}>Join as {player.name}</Button></li>)}
    </ul>
    </>
}

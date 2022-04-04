import { useState } from 'react'
import { useSelector } from 'react-redux'
import { generateInviteLink } from '../../api/players'
import { selectGameId } from '../../slices/gameSlice'
import { selectConnections, selectPlayers } from '../../slices/playerSlice'
import { Box } from '../Box'
import { Button } from '../Button'

const inviteLinkHandler =
    (
        gameId: string,
        setOpacity: React.Dispatch<React.SetStateAction<boolean>>,
        setTransition: React.Dispatch<React.SetStateAction<boolean>>
    ) =>
    () => {
        const url = generateInviteLink(gameId)
        navigator.clipboard.writeText(url)
        setOpacity(true)
        setTimeout(() => {
            setTransition(true)
            setOpacity(false)
            setTimeout(() => {
                setTransition(false)
            }, 1000)
        }, 0)
    }

export const Players = () => {
    const gameId = useSelector(selectGameId)
    const players = useSelector(selectPlayers)
    const connections = useSelector(selectConnections)

    const [opacity, setOpacity] = useState(false)
    const [transition, setTransition] = useState(false)

    const strifeConnected = connections.includes('strife')
    const strifeColour = strifeConnected ? 'bg-emerald-500' : 'bg-red-500'

    return (
        <Box>
            <div className="flex justify-between">
                <h2 className="text-lg">Players</h2>
                {gameId !== undefined && (
                    <Button onClick={inviteLinkHandler(gameId, setOpacity, setTransition)}>Copy Invite Link</Button>
                )}
                <div
                    className={`${transition ? 'transition-opacity duration-1000' : ''} ${
                        opacity ? 'opacity-1' : 'opacity-0'
                    }`}
                >
                    Copied
                </div>
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

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { generateInviteLink } from '../../api/players'
import { selectGameId } from '../../slices/gameSlice'
import { selectConnections, selectPlayers } from '../../slices/playerSlice'
import { Box } from '../Box'
import { Button } from '../Button'
import { H2 } from '../H2'

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
    const strifeColour = strifeConnected ? 'bg-grey-300' : 'bg-transparent'

    return (
        <Box>
            <div className="flex justify-between">
                <H2>Players</H2>
                <div className="relative">
                    {gameId !== undefined && (
                        <Button onClick={inviteLinkHandler(gameId, setOpacity, setTransition)}>Copy Invite Link</Button>
                    )}
                    <div
                        className={`${transition ? 'transition-opacity duration-1000' : ''} ${
                            opacity ? 'opacity-1' : 'opacity-0'
                        } absolute w-44 p-2 text-center`}
                    >
                        Copied to clipboard!
                    </div>
                </div>
            </div>
            <ul>
                <li>
                    <div className={`${strifeColour} h-4 w-4 rounded-xl border-2 inline-block`} /> Strife Player
                </li>
                {players.map((player) => {
                    const isConnected = connections.includes(player.id ?? '')
                    const colour = isConnected ? 'bg-grey-300' : 'bg-transparent'
                    return (
                        <li key={player.id}>
                            <div className={`${colour} h-4 w-4 rounded-xl border-2 inline-block`} /> {player.name}
                        </li>
                    )
                })}
            </ul>
        </Box>
    )
}

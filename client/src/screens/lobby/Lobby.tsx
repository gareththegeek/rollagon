import React, { ChangeEvent, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { LobbyPlayers } from '../../components/players/LobbyPlayers'
import { setGameId } from '../../slices/gameSlice'
import { getPlayersAsync, joinHeroAsync, joinStrifeAsync } from '../../slices/playerSlice'

const joinStrifeClick = (dispatch: AppDispatch, navigate: NavigateFunction, gameId: string) => async () => {
    const result = await dispatch(joinStrifeAsync(gameId))
    if (result.meta.requestStatus === 'fulfilled') {
        navigate(`/game/${gameId}`)
    }
}

const joinHeroClick = async (dispatch: AppDispatch, navigate: NavigateFunction, gameId: string, player: Player) => {
    const result = await dispatch(joinHeroAsync({ gameId, player }))
    if (result.meta.requestStatus === 'fulfilled') {
        navigate(`/game/${gameId}`)
    }
}

export const Lobby = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const { gameId } = useParams()

    useEffect(() => {
        dispatch(setGameId(gameId))
        dispatch(getPlayersAsync(gameId!))
    }, [dispatch, gameId])

    return (
        <main className="md:container max-w-screen-md mx-3 md:mx-auto flex flex-col md:pt-16">
            <h2>Are you Strife or a Hero?</h2>
            <p className="pb-6">Every game of AGON needs one Strife player and at least two Hero Players.</p>
            <section>
                <h3>Strife player</h3>
                <p className="pb-3">The Strife player challenges the Heroes with worthy Contests.</p>
                <Button className="w-full md:w-auto mb-6" onClick={joinStrifeClick(dispatch, navigate, gameId!)}>Join as Strife Player</Button>
            </section>
            <section>
                <h3 className="mb-2">Hero player</h3>
                <p className="pb-3">Hero players contend against the Contests presented by the Strife player.</p>
                <div className="flex flex-col sm:flex-row mb-6">
                    <Input
                        className="flex-grow md:mr-6 mb-4 sm:mb-0"
                        value={text}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                        placeholder="Enter your Hero's Name"
                        aria-label="Enter your Hero's Name"
                    />
                    <Button onClick={() => joinHeroClick(dispatch, navigate, gameId!, { name: text })}>
                        Join as new Hero
                    </Button>
                </div>
            </section>
            <LobbyPlayers onClick={(player: Player) => joinHeroClick(dispatch, navigate, gameId!, player)} />
        </main>
    )
}

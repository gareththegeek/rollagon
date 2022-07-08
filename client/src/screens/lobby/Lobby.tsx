import React, { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { LobbyPlayers } from '../../components/players/LobbyPlayers'
import { setGameId } from '../../slices/gameSlice'
import { getPlayersAsync, joinHeroAsync, joinStrifeAsync } from '../../slices/playerSlice'
import { selectIsLoading } from '../../slices/statusSlice'

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
    const isLoading = useSelector(selectIsLoading)
    const [text, setText] = useState('')
    const { gameId } = useParams()

    useEffect(() => {
        dispatch(setGameId(gameId))
        dispatch(getPlayersAsync(gameId!))
    }, [dispatch, gameId])

    return (
        <main className="max-w-screen-md mx-3 md:mx-auto mt-8 md:mt-16">
            <section>
                <h2>Are you Strife or a Hero?</h2>
                <p>Every game of AGON needs one Strife player and at least two Hero Players.</p>
            </section>
            <section>
                <h3>Strife player</h3>
                <p>The Strife player challenges the Heroes with worthy Contests.</p>
                <div>
                    <Button disabled={isLoading} className="w-full md:w-auto" onClick={joinStrifeClick(dispatch, navigate, gameId!)}>
                        Join as Strife Player
                    </Button>
                </div>
            </section>
            <section>
                <h3>Hero player</h3>
                <p>Hero players contend against the Contests presented by the Strife player.</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                    <Input
                        className="flex-grow"
                        value={text}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                        placeholder="Enter your Hero's Name"
                        aria-label="Enter your Hero's Name"
                    />
                    <Button disabled={isLoading} onClick={() => joinHeroClick(dispatch, navigate, gameId!, { name: text })}>
                        Join as new Hero
                    </Button>
                </div>
                <LobbyPlayers disabled={isLoading} onClick={(player: Player) => joinHeroClick(dispatch, navigate, gameId!, player)} />
            </section>
        </main>
    )
}

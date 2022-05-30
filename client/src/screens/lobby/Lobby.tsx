import React, { ChangeEvent, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Button } from '../../components/Button'
import { H1 } from '../../components/H1'
import { H3 } from '../../components/H3'
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
        <>
            <H1>Lobby</H1>
            <h3 className="mb-8 text">Are you the strife player or a hero player?</h3>
            <div className="m-8">
                <H3>Strife player</H3>
                <Button onClick={joinStrifeClick(dispatch, navigate, gameId!)}>Join as Strife Player</Button>
            </div>
            <div className="m-8">
                <H3 className="mb-2">Hero player</H3>
                <Input
                    value={text}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                    placeholder="Hero's name..."
                />
                <Button onClick={() => joinHeroClick(dispatch, navigate, gameId!, { name: text })}>
                    Join as new Hero
                </Button>
                <LobbyPlayers onClick={(player: Player) => joinHeroClick(dispatch, navigate, gameId!, player)} />
            </div>
        </>
    )
}

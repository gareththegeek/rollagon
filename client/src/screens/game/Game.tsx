import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import { Players } from '../../components/players/Players'
import { createContestAsync, selectContestStatus } from '../../slices/contestSlice'
import { getGameAsync, selectGameId } from '../../slices/gameSlice'
import { selectIsStrifePlayer } from '../../slices/playerSlice'
import { Challenge } from './Challenge'
import { CreateContest } from './CreateContest'

export const Game = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const gameId = useSelector(selectGameId)
    const contestStatus = useSelector(selectContestStatus)
    const isStrifePlayer = useSelector(selectIsStrifePlayer)

    useEffect(() => {
        if (gameId !== undefined) {
            dispatch(getGameAsync(gameId!))
        } else {
            navigate('/')
        }
    }, [navigate, gameId])

    if (gameId === undefined) {
        return <></>
    }
    
    return (
        <div>
            Game
            {contestStatus === 'complete' && isStrifePlayer && (
                <button onClick={() => dispatch(createContestAsync(gameId))}>Create Contest</button>
            )}
            {contestStatus === 'new' && isStrifePlayer && <CreateContest />}
            {contestStatus === 'targetSet' && <Challenge />}
            <Players />
        </div>
    )
}

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import { selectContestStatus } from '../../slices/contestSlice'
import { getGameAsync, selectGameId, selectTab, TabType } from '../../slices/gameSlice'
import { Challenge } from './Challenge'
import { EnterContest } from './EnterContest'
import { CreateContest } from './CreateContest'
import { ContestResult } from './ContestResult'
import { Notes } from '../../components/notes/Notes'
import { Header } from '../../components/header/Header'
import { About } from '../about/About'

export const Game = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const gameId = useSelector(selectGameId)
    const params = useParams()
    const contestStatus = useSelector(selectContestStatus)
    const tab = useSelector(selectTab)

    useEffect(() => {
        if (gameId !== undefined) {
            dispatch(getGameAsync(gameId!))
        } else if (params.gameId !== undefined) {
            navigate(`/join/${params.gameId}`)
        } else {
            navigate('/')
        }
    }, [dispatch, navigate, gameId, params.gameId])

    if (gameId === undefined) {
        return <></>
    }

    return (
        <div className="flex items-stretch max-w-screen-xl mx-auto">
            <Header />
            <main className="w-screen min-h-screen">
                {tab === TabType.Contests && (
                    <div className="container py-16">
                        {contestStatus === 'new' && <CreateContest />}
                        {contestStatus !== 'new' && <Challenge />}
                        {contestStatus === 'targetSet' && <EnterContest />}
                        {contestStatus === 'complete' && <ContestResult />}
                    </div>
                )}
                {tab === TabType.Notes && <Notes />}
                {tab === TabType.About && <About />}
            </main>
        </div>
    )
}

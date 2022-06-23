import React, { useEffect, useState } from 'react'
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
import { BurgerMenu } from '../../components/header/BurgerMenu'
import { BurgerButton } from '../../components/header/BurgerButton'

export const Game = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const gameId = useSelector(selectGameId)
    const params = useParams()
    const contestStatus = useSelector(selectContestStatus)
    const tab = useSelector(selectTab)

    const [menuOpen, setMenuOpen] = useState(false)

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen)
    }

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
        <div className="md:flex md:items-stretch max-w-screen-xl mx-3 md:mx-auto">
            <h4 className="flex md:hidden border-b-2 -mx-3 py-3">
                <BurgerButton onClick={handleMenuClick} isOpen={menuOpen} />
                Agon Dice Roller
            </h4>
            {menuOpen ? (
                <BurgerMenu />
            ) : (
                <>
                    <Header />
                    <main className="w-full min-h-screen">
                        {tab === TabType.Contests && (
                            <div className="md:container md:py-16">
                                {contestStatus === 'new' && <CreateContest />}
                                {contestStatus !== 'new' && <Challenge />}
                                {contestStatus === 'targetSet' && <EnterContest />}
                                {contestStatus === 'complete' && <ContestResult />}
                            </div>
                        )}
                        {tab === TabType.Notes && <Notes />}
                        {tab === TabType.About && <About />}
                    </main>
                </>
            )}
        </div>
    )
}

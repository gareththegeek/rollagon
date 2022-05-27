import React from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Connection } from './components/header/Connection'
import { Errors } from './components/header/Errors'
import { Header } from './components/header/Header'
import { About } from './screens/about/About'
import { Game } from './screens/game/Game'
import { Lobby } from './screens/lobby/Lobby'
import { Splash } from './screens/splash/Splash'

function App() {
    return (
        <div className="bg-grey-100 h-full">
            <div className="container max-w-screen-md mx-auto flex flex-col">
                <Header />
                <BrowserRouter>
                    <Connection />
                    <Errors />
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/game/:gameId" element={<Game />} />
                        <Route path="/join/:gameId" element={<Lobby />} />
                        <Route path="/" element={<Splash />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    )
}

export default App

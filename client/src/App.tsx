import React from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Connection } from './components/header/Connection'
import { About } from './screens/about/About'
import { Game } from './screens/game/Game'
import { Lobby } from './screens/lobby/Lobby'
import { Splash } from './screens/splash/Splash'

function App() {
    return (
        <div className="h-full min-h-screen mx-3">
            <BrowserRouter>
                <Connection />
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/game/:gameId" element={<Game />} />
                    <Route path="/join/:gameId" element={<Lobby />} />
                    <Route path="/" element={<Splash />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App

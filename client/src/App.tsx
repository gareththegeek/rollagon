import React from 'react'
import { Route, Router, Routes } from 'react-router'
import { history } from './app/store'
import { About } from './screens/about/About'
import { Game } from './screens/game/Game'
import { Lobby } from './screens/lobby/Lobby'
import { Splash } from './screens/splash/Splash'

function App() {
    return (
        <div className="App">
            <Router location={history.location} navigator={history}>
                <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/join/:gameId" element={<Lobby />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App

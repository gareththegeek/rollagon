import React from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Connection } from './components/header/Connection'
import { About } from './screens/about/About'
import { Game } from './screens/game/Game'
import { Lobby } from './screens/lobby/Lobby'
import { Splash } from './screens/splash/Splash'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useTranslation, initReactI18next } from 'react-i18next'
import * as de from './translations/de.json'
import * as en from './translations/en.json'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            de,
            en
        },
        detection: {
            order: ['querystring', 'navigator'],
            lookupQuerystring: 'lng'
        },
        fallbackLng: 'en',
        supportedLngs: ['de', 'en'],
        interpolation: {
            escapeValue: false
        }
    })

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

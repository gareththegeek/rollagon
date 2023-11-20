import React, { useEffect, useReducer } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Connection } from './components/header/Connection'
import { About } from './screens/about/About'
import { Game } from './screens/game/Game'
import { Lobby } from './screens/lobby/Lobby'
import { Splash } from './screens/splash/Splash'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import * as de from './translations/de.json'
import * as en from './translations/en.json'
import './theme.css'
import { useSelector } from 'react-redux'
import { selectCurrentTheme } from './slices/themeSlice'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            de: { default: de },
            en: { default: en }
        },
        ns: ['default'],
        defaultNS: 'default',
        fallbackNS: 'default',
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
    const theme = useSelector(selectCurrentTheme)
    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    useEffect(forceUpdate, [forceUpdate, theme])

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

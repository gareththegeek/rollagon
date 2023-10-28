import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18n from 'i18next'
import { RootState } from '../app/store'

export interface Theme {
    name: string
    folder: string
    default?: boolean
}

export interface ThemeState {
    current: string | undefined
    themes: Theme[]
    loading: boolean
    error: string | undefined
}

const addThemeLanguage = (theme: string) => async (language: string) => {
    try {
        const response = await fetch(`/themes/${theme}/${language}.json`)
        const translations = await response.json()

        i18n.loadNamespaces(theme, (err) => {
            if (err) {
                console.error(err)
                return
            }
            i18n.addResourceBundle(language, theme, translations, true, true)
            console.info(`Added ${language} translations for ${theme}`)
        })
    } catch {
        console.warn(`Language ${language} not supported for ${theme}`)
    }
}

const fetchCssVariables = (theme: string) => {
    const location = `/themes/${theme}/theme.css`
    const head = document.head
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = location
    head.appendChild(link)
}

export const setCurrentThemeAsync = createAsyncThunk(
    'themes/set',
    async (theme: string | undefined, { dispatch, rejectWithValue }) => {
        try {
            if (theme) {
                await Promise.all(i18n.languages.map(addThemeLanguage(theme)))
                fetchCssVariables(theme)
            }

            dispatch(set(theme))
        } catch (e: any) {
            dispatch(error(e.message))
            return rejectWithValue(e.message)
        }
    }
)

export const fetchThemesAsync = createAsyncThunk('themes/fetch', async (_, { dispatch, rejectWithValue, getState }) => {
    try {
        dispatch(beginFetch())
        const response = await fetch('/themes/index.json')
        const { themes }: { themes: Theme[] } = await response.json()
        dispatch(success(themes))
        const state = getState() as ThemeState
        if (!state.current) {
            const defaultTheme = themes.find((x: Theme) => x.default)
            dispatch(setCurrentThemeAsync(defaultTheme?.folder))
        }
    } catch (e: any) {
        dispatch(error(e.message))
        return rejectWithValue(e.message)
    }
})

const initialState: ThemeState = {
    current: undefined,
    themes: [],
    loading: false,
    error: undefined
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        beginFetch: (state) => {
            state.loading = true
            state.error = undefined
        },
        error: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
        success: (state, { payload }) => {
            state.loading = false
            state.error = undefined
            state.themes = payload
        },
        set: (state, { payload }) => {
            state.current = payload
        }
    }
})

export const { beginFetch, error, success, set } = themeSlice.actions
export const thunks = [fetchThemesAsync, setCurrentThemeAsync]

export const selectThemes = ({ theme: { loading, error, themes } }: RootState) => ({ loading, error, themes })
export const selectCurrentTheme = ({ theme: { current } }: RootState) => current

export default themeSlice.reducer

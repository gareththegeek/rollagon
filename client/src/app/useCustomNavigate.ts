import { useSelector } from 'react-redux'
import { NavigateFunction, NavigateOptions, To, useNavigate as useWrappedNavigate } from 'react-router'
import { selectCurrentTheme } from '../slices/themeSlice'

export const useNavigate = (): NavigateFunction => {
    const wrappedNavigate = useWrappedNavigate()
    const theme = useSelector(selectCurrentTheme)
    
    return ((to: To, options?: NavigateOptions) => {
        const themedTo = `${to}${!!theme ? `?theme=${theme}` : ''}`
        wrappedNavigate(themedTo, options)
    }) as NavigateFunction
}

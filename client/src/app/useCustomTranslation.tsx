import { Trans as WrappedTrans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentTheme } from '../slices/themeSlice'

export const useCustomTranslation = () => {
    const { t: wrappedT } = useTranslation()
    const theme = useSelector(selectCurrentTheme) ?? 'default'

    const t = (key: string, options?: any) => {
        return wrappedT(key, { ns: theme, ...options }) as unknown as string
    }

    return { t }
}

export const Trans = ({ i18nKey, ...props }: any) => {
    const theme = useSelector(selectCurrentTheme) ?? 'default'

    const namespacedKey = `${theme}:${i18nKey}`
    return <WrappedTrans i18nKey={namespacedKey} {...props} />
}

import { Trans, useCustomTranslation } from '../app/useCustomTranslation'
import { A } from './A'

export const LinkTrans = (props: any) => {
    const { t } = useCustomTranslation()
    console.log(t('link5'))
    return (
        <Trans
            {...props}
            components={{
                link1: <A href={`${t('link1')}`} />,
                link2: <A href={`${t('link2')}`} />,
                link3: <A href={`${t('link3')}`} />,
                link4: <A href={`${t('link4')}`} />,
                link5: <A href={`${t('link5')}`} />,
                link6: <A href={`${t('link6')}`} />,
                link7: <A href={`${t('link7')}`} />,
                link8: <A href={`${t('link8')}`} />,
                link9: <A href={`${t('link9')}`} />,
                link10: <A href={`${t('link10')}`} />
            }}
        />
    )
}

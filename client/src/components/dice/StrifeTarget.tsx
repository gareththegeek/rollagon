import React from 'react'
import { useTranslation } from 'react-i18next'
import { Strife } from '../../api/strife'
import { Roll } from './Roll'

export interface StrifeTargetProps {
    strife: Strife
}

export const StrifeTarget: React.FC<StrifeTargetProps> = ({ strife }) => {
    const { t } = useTranslation()
    return (
        <Roll
            value={strife.targetNumber!}
            label=""
            colour="bg-grey-300 border-black"
            title={t('This is the target number to beat in this contest') ?? ''}
        />
    )
}

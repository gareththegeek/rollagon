import React from 'react'
import { useCustomTranslation } from '../../app/useCustomTranslation'
import { Strife } from '../../api/strife'
import { Roll } from './Roll'

export interface StrifeTargetProps {
    strife: Strife
}

export const StrifeTarget: React.FC<StrifeTargetProps> = ({ strife }) => {
    const { t } = useCustomTranslation()
    return (
        <Roll
            value={strife.targetNumber!}
            label=""
            colour="bg-grey-300 border-black"
            title={t('This is the target number to beat in this contest') ?? ''}
        />
    )
}

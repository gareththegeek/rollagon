import React from 'react'
import { useTranslation } from 'react-i18next'
import { HarmTagType } from '../../api/strife'
import { Tag } from './Tag'

export interface TagsProps {
    tags: HarmTagType[]
}

export const Tags = ({ tags }: TagsProps) => {
    const { t } = useTranslation()
    
    if (tags.length === 0) {
        return <></>
    }
    return (
        <section>
            <h4>{t('Harms')}</h4>
            {tags.map((tag, idx) => (
                <Tag key={`tags-${idx}`} tag={tag} />
            ))}
        </section>
    )
}

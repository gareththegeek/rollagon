import React from 'react'
import { HarmTagType } from '../../api/contests'
import { Tag } from './Tag'

export interface TagsProps {
    tags: HarmTagType[]
}

export const Tags = ({ tags }: TagsProps) => {
    return <>{tags.map((tag, idx) => <Tag key={`tags-${idx}`} tag={tag} />)}</>
}

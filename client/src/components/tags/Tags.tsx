import React from 'react'
import { HarmTagType } from '../../api/strife'
import { Tag } from './Tag'

export interface TagsProps {
    tags: HarmTagType[]
}

export const Tags = ({ tags }: TagsProps) => {
    if (tags.length === 0) {
        return <></>
    }
    return <><div>Tags:</div>{tags.map((tag, idx) => <Tag key={`tags-${idx}`} tag={tag} />)}</>
}

import React from 'react'
import { HarmTagType } from '../../api/strife'
import { H3 } from '../H3'
import { Tag } from './Tag'

export interface TagsProps {
    tags: HarmTagType[]
}

export const Tags = ({ tags }: TagsProps) => {
    if (tags.length === 0) {
        return <></>
    }
    return (
        <>
            <H3 className="mt-8">Tags</H3>
            {tags.map((tag, idx) => (
                <Tag key={`tags-${idx}`} tag={tag} />
            ))}
        </>
    )
}

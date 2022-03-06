import React from 'react'
import { HarmTagType } from '../../api/contests'

export interface TagProps {
    tag: HarmTagType
}

export const Tag = ({ tag }: TagProps) => {
    return <div>{tag}</div>
}

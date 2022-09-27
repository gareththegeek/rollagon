import React from 'react'
import { HarmTagType } from '../../api/strife'
import { Diamond } from '../Diamond'

export interface TagProps {
    tag: HarmTagType
}

const HarmTagsDescription: Record<HarmTagType, React.ReactElement> = {
    epic: <p>The Contest is&nbsp;<b>Epic</b>&nbsp;- Heroes who enter the contest must mark Pathos</p>,
    mythic: <p>The Contest is&nbsp;<b>Mythic</b>&nbsp;- Heroes who enter the contest must spend Divine Favour</p>,
    perilous: <p>The Contest is&nbsp;<b>Perilous</b>&nbsp;- Heroes who suffer must mark Pathos</p>,
    sacred: <p>The Contest is&nbsp;<b>Sacred</b>&nbsp;- Heroes who suffer must spend Divine Favour</p>
}

export const Tag = ({ tag }: TagProps) => {
    return (
        <ul className="flex flex-col gap-3">
            <li className="flex"><Diamond className="mr-6 w-4 h-4 min-w-[0.8rem] min-h-[0.8rem]" />{HarmTagsDescription[tag]}</li>
        </ul>
    )
}

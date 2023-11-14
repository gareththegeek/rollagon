import React from 'react'
import { Trans } from 'react-i18next'
import { HarmTagType } from '../../api/strife'
import { Diamond } from '../Diamond'

export interface TagProps {
    tag: HarmTagType
}

const HarmTagsDescription: Record<HarmTagType, React.ReactElement> = {
    epic: <p><Trans i18nKey="ContestIsEpic" components={{ bold: <b /> }}>The Contest is <b>Epic</b> - Heroes who enter the contest must mark Pathos</Trans></p>,
    mythic: <p><Trans i18nKey="ContestIsMythic" components={{ bold: <b /> }}>The Contest is <b>Mythic</b> - Heroes who enter the contest must spend Divine Favour</Trans></p>,
    perilous: <p><Trans i18nKey="ContestIsPerilous" components={{ bold: <b /> }}>The Contest is <b>Perilous</b> - Heroes who suffer must mark Pathos</Trans></p>,
    sacred: <p><Trans i18nKey="ContestIsSacred" components={{ bold: <b /> }}>The Contest is <b>Sacred</b> - Heroes who suffer must spend Divine Favour</Trans></p>
}

export const Tag = ({ tag }: TagProps) => {
    return (
        <ul className="flex flex-col gap-3">
            <li className="flex"><Diamond className="mr-6 w-4 h-4 min-w-[0.8rem] min-h-[0.8rem]" />{HarmTagsDescription[tag]}</li>
        </ul>
    )
}

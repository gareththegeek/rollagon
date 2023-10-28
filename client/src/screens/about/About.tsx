import React from 'react'
import {Trans, useCustomTranslation } from '../../app/useCustomTranslation'
import { A } from '../../components/A'
import { useTheme } from '../../app/useTheme'

export const About = () => {
    useTheme()
    const { t } = useCustomTranslation()
    
    return (
        <section>
            <h2>{t('About this App')}</h2>
            <p><Trans i18nKey="AboutCreatedBy">This app was created by <A href="https://www.reddit.com/user/gareththegeek/">@gareth</A> and <A href="https://twitter.com/sporgory">@sporgory</A> with the help of the <A href="https://discord.gg/2kWxhJywGq">AGON fan Discord community.</A></Trans></p>
            <p><Trans i18nKey="AboutFeedback">If you'd like to give feedback or get involved, check out the <A href="https://github.com/gareththegeek/rollagon">GitHub repo.</A></Trans></p>
            <p><Trans i18nKey="AboutAgon">This is a fan-made dice-rolling app for AGON. AGON is an action-packed roleplaying game about epic Heroes who face trials from the Gods in an ancient world of myth and legend. Learn more about it, and the Paragon system, at <A href="http://agon-rpg.com">agon-rpg.com</A></Trans></p>
            <p><Trans i18nKey="AboutRules">At least one person playing should be familiar with the AGON rulebook.</Trans></p>
            <p><Trans i18nKey="AboutApp">This app is a lightweight dicerolling app, focused on  resolving and narrating AGON Contests. It is not a campaign or character tracker - you'll still need to manage that on your own.</Trans></p>
            <img alt="Stylised greek hoplite helmet" className="mt-20 mx-auto w-1/2 hidden md:block" src="/images/agon-big.png" />
        </section>
    )
}

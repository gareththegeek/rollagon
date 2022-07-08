import React from 'react'
import { A } from '../../components/A'

export const About = () => {
    return (
        <section>
            <h2>About this App</h2>
            <p>This app was created by <A href="https://www.reddit.com/user/gareththegeek/">@gareth</A> and <A href="https://twitter.com/sporgory">@sporgory</A> with the help of the <A href="https://discord.gg/2kWxhJywGq">AGON fan Discord community.</A></p>
            <p>If you'd like to give feedback or get involved, check out the <A href="https://github.com/gareththegeek/rollagon">GitHub repo.</A></p>
            <p>This is a fan-made dice-rolling app for AGON. AGON is an action-packed roleplaying game about epic Heroes who face trials from the Gods in an ancient world of myth and legend. Learn more about it, and the Paragon system, at <A href="http://agon-rpg.com">agon-rpg.com</A></p>
            <p>At least one person playing should be familiar with the AGON rulebook.</p>
            <p>This app is a lightweight dicerolling app, focused on  resolving and narrating AGON Contests. It is not a campaign or character tracker - you'll still need to manage that on your own.</p>
            <img className="mt-20 mx-auto w-1/2 hidden md:block" src="/images/agon-big.png" />
        </section>
    )
}

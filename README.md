# Agon Dice Roller

This is a fan-made dice-rolling app for AGON. AGON is an action-packed roleplaying game about epic Heroes who face trials from the Gods in an ancient world of myth and legend. Learn more about it, and the Paragon system, at [agon-rpg.com](http://agon-rpg.com)

This app is a lightweight dicerolling app, focused on resolving and narrating AGON Contests. It is not a campaign or character tracker - you'll still need to manage that on your own.

This app was created by [gareththegeek](https://www.reddit.com/user/gareththegeek/) and [@sporgory](https://twitter.com/sporgory) with the help of the [AGON fan Discord community](https://discord.gg/2kWxhJywGq).

## Build & run

Build to run on `node v16`

`npm install` to install dependencies.

### Server

Server will host the API on `http://localhost:8080`

```bash
cd server
npm run start:dev
```

### Client

Client is a React Single Page App built with react-scripts

```bash
cd client
SET REACT_APP_API_FQDN=http://localhost:8080&&npm start
```

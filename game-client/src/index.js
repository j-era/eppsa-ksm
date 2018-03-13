import React from "react"
import ReactDOM from "react-dom"

import ContentServer from "./api/contentServer"
import { getCookie, setCookie } from "./cookie"
import GameServer from "./api/gameServer"

const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)
const gameServer = new GameServer(process.env.GAME_SERVER_URI)

contentServer.getData().then(async (content) => {
  const gameId = getCookie("gameId")
  if (gameId) {
    console.log("Taking gameId from cookie")
    console.log(await gameServer.resumeGame(gameId))
  } else {
    console.log("Starting new game")
    const gameInfo = await gameServer.newGame("Foo", 1)
    setCookie("gameId", gameInfo.gameId)
  }

  ReactDOM.render(
    <div>
      <p>React here!</p>
    </div>,
    document.getElementById("app")
  )
})

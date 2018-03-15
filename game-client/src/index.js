import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore, combineReducers } from "redux"
import { createLogger } from "redux-logger"

import Application from "./components/application"
import { updateGameInfo, updateName } from "./actionCreators"
import * as reducers from "./reducers"
import ContentServer from "./api/contentServer"
import { getCookie, setCookie } from "./cookie"
import GameServer from "./api/gameServer"

const store = applyMiddleware(createLogger())(createStore)(combineReducers(reducers))
const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)
const gameServer = new GameServer(process.env.GAME_SERVER_URI)

contentServer.getData().then(async (content) => {
  if (!await resumeGame()) {
    await startNewGame()
  }

  render(
    <Provider store={ store }>
      <Application content={ content } />
    </Provider>,
    document.getElementById("app")
  )
})

async function resumeGame() {
  const gameId = getCookie("gameId")
  if (gameId) {
    const gameInfo = await gameServer.resumeGame(gameId)
    if (gameInfo) {
      console.log("Resuming game from cookie")
      updateGameInfo(gameInfo)
      return true
    }
  }

  return false
}

async function startNewGame() {
  console.log("Starting new game")
  const gameInfo = await gameServer.newGame("Foo", 1)
  updateGameInfo(gameInfo)
  setCookie("gameId", gameInfo.gameId)
}

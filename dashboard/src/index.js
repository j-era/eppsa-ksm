import querystring from "querystring"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore, combineReducers } from "redux"
import { createLogger } from "redux-logger"

import Application from "./components/application"
import * as reducers from "./reducers"
import ContentServer from "./api/contentServer"
import GameServer from "./api/gameServer"
import * as actions from "./actionCreators"

const store = applyMiddleware(createLogger())(createStore)(combineReducers(reducers))
const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)
const gameServer = new GameServer(process.env.GAME_SERVER_URI)

Promise.all([
  contentServer.getData(),
  gameServer.findRecentFinishedGames(),
  gameServer.findHighscoreGames(),
  gameServer.findConnectedGames()
]).then(([content, recentFinishedGames, highscoreGames, connectedGames]) => {
  store.dispatch(actions.updateRecentFinishedGames(recentFinishedGames))
  store.dispatch(actions.updateHighscoreGames(highscoreGames))
  store.dispatch(actions.updateConnectedGames(connectedGames))

  render(
    <Provider store={ store }>
      <Application
        content={ content }
        assetServerUri={ process.env.ASSET_SERVER_URI } />
    </Provider>,
    document.getElementById("app")
  )
})

gameServer.on("recentFinishedGames", (games) => {
  store.dispatch(actions.updateRecentFinishedGames(games))
})

gameServer.on("highscoreGames", (games) => {
  store.dispatch(actions.updateHighscoreGames(games))
})

gameServer.on("connectedGames", (games) => {
  store.dispatch(actions.updateConnectedGames(games))
})

gameServer.on("connect", () => {
  store.dispatch(actions.updateConnected(true))
})

gameServer.on("disconnect", () => {
  store.dispatch(actions.updateConnected(false))
})

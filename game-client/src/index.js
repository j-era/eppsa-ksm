import omit from "lodash.omit"
import mapValues from "lodash.mapvalues"
import querystring from "querystring"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import thunk from "redux-thunk"
import { applyMiddleware, createStore, combineReducers } from "redux"
import { createLogger } from "redux-logger"

import Application from "./components/application"
import * as gameStates from "./gameStates"
import * as reducers from "./reducers"
import ContentServer from "./api/contentServer"
import { getCookie } from "./cookie"
import GameServer from "./api/gameServer"
import * as actions from "./actionCreators"

const store = createStore(combineReducers(reducers), applyMiddleware(thunk, createLogger()))
const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)
const gameServer = new GameServer(process.env.GAME_SERVER_URI)

const config = querystring.parse(window.location.search.substring(1))

contentServer.getData().then(transform).then(async (content) => {
  const maxChallenges = Object.keys(content.challenges).length - 1

  if (config.avatar) {
    store.dispatch(actions.updateAvatar(config.avatar))
  }

  const resumableGame = await findResumableGame()
  if (resumableGame) {
    if (config.token) {
      store.dispatch(actions.resumeGame(resumableGame.gameId, gameServer))
    } else {
      store.dispatch(actions.updateGameState(gameStates.RESUME_OR_NEW_GAME_SELECTION))
    }
  } else {
    if (config.token) {
      store.dispatch(actions.updateGameState(gameStates.NAVIGATION_TO_START))
    } else {
      if (config.avatar) {
        store.dispatch(actions.updateGameState(gameStates.NEW_GAME_NAME_SELECTION))
      } else {
        store.dispatch(actions.updateGameState(gameStates.NEW_GAME_AVATAR_SELECTION))
      }
    }
  }

  window.addEventListener("message", actions.handleChallengeMessage.bind(this, gameServer), false)

  render(
    <Provider store={ store }>
      <Application
        content={ content }
        resumableGame={ resumableGame }
        assetServerUri={ process.env.ASSET_SERVER_URI }
        contentServerUri={ process.env.CONTENT_SERVER_URI }
        gameServerUri={ process.env.GAME_SERVER_URI }
        maxChallenges={ maxChallenges }
        dispatch={ store.dispatch }
        gameServer={ gameServer } />
    </Provider>,
    document.getElementById("app")
  )
})

function transform(content) {
  return Object.assign(mapValues(omit(content, "index"), transform), content.index)
}

async function findResumableGame() {
  const gameId = getCookie("gameId")
  if (gameId) {
    const game = await gameServer.findGame(gameId)

    if (game && !game.finished) {
      return game
    }
  }
  return null
}

gameServer.on("connectedGames", (connectedGames) => {
  store.dispatch(actions.updateConnectedGames(connectedGames))
})

gameServer.on("connect", () => {
  store.dispatch(actions.updateConnected(true))
})

gameServer.on("disconnect", () => {
  store.dispatch(actions.updateConnected(false))
})

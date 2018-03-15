import omit from "lodash.omit"
import mapValues from "lodash.mapvalues"
import querystring from "querystring"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore, combineReducers } from "redux"
import { createLogger } from "redux-logger"

import Application from "./components/application"
import { startChallenge, updateGameInfo, updateName, updatePreviousGameInfo } from "./actionCreators"
import * as reducers from "./reducers"
import ContentServer from "./api/contentServer"
import { getCookie, setCookie } from "./cookie"
import GameServer from "./api/gameServer"

const config = querystring.parse(window.location.search.substring(1))

const store = applyMiddleware(createLogger())(createStore)(combineReducers(reducers))
const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)
const gameServer = new GameServer(process.env.GAME_SERVER_URI)

contentServer.getData().then(transform).then(async (content) => {
  let previousGameInfo = null
  const gameId = getCookie("gameId")
  if (gameId) {
    previousGameInfo = await gameServer.getGameInfo(gameId)
  }
  
  render(
    <Provider store={ store }>
      <Application
        content={ content }
        previousGameInfo={ previousGameInfo }
        assetServerUri={ process.env.ASSET_SERVER_URI }
        onResumeGame={ onResumeGame }
        onStartNewGame={ onStartNewGame }
        onUpdateName={ (name) => store.dispatch(updateName(name)) }
        onStartChallenge={ onStartChallenge }
        onChallengeReady={ onChallengeReady }
      />
    </Provider>,
    document.getElementById("app")
  )
})

function transform(content) {
  return Object.assign(mapValues(omit(content, "index"), transform), content.index)
}

async function onResumeGame(gameId) {
  store.dispatch(updateGameInfo(await gameServer.resumeGame(gameId)))
}

async function onStartNewGame(name, avatar) {
  console.log("Starting new game")
  const gameInfo = await gameServer.newGame(name, avatar)
  store.dispatch(updateGameInfo(gameInfo))
  setCookie("gameId", gameInfo.gameId)
}

async function onStartChallenge() {
  await gameServer.startChallenge()
  store.dispatch(startChallenge())
}

async function onChallengeReady(challengeWindow, config, uri) {
  setTimeout(() => challengeWindow.postMessage(config, uri), 100)
}
window.addEventListener("message", receiveMessage, false);

async function receiveMessage(event)
{
  store.dispatch(updateGameInfo(await gameServer.completeChallenge(event.data)))
}
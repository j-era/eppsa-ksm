import omit from "lodash.omit"
import mapValues from "lodash.mapvalues"
import querystring from "querystring"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore, combineReducers } from "redux"
import { createLogger } from "redux-logger"

import Application from "./components/application"
import { startChallenge, updateGame, updateName, updatepreviousGame } from "./actionCreators"
import * as reducers from "./reducers"
import ContentServer from "./api/contentServer"
import { getCookie, setCookie } from "./cookie"
import GameServer from "./api/gameServer"

const config = querystring.parse(window.location.search.substring(1))

const store = applyMiddleware(createLogger())(createStore)(combineReducers(reducers))
const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)
const gameServer = new GameServer(process.env.GAME_SERVER_URI)

contentServer.getData().then(transform).then(async (content) => {
  let previousGame = null
  const gameId = getCookie("gameId")
  if (gameId) {
    previousGame = await gameServer.findGame(gameId)
  }
  
  render(
    <Provider store={ store }>
      <Application
        content={ content }
        previousGame={ previousGame }
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
  setCookie("gameId", gameInfo.gameId)
  store.dispatch(updateGame(game))
}

async function onStartChallenge() {
  await gameServer.startChallenge()
  store.dispatch(startChallenge())
}

async function onChallengeReady(challengeWindow, config, uri) {
  setTimeout(() => challengeWindow.postMessage(config, uri), 200)
}
window.addEventListener("message", receiveMessage, false);

async function receiveMessage(event)
{
  // filter for challange messages (react dev tools)
  if(event.data.source == "challenge"){
    store.dispatch(updateGame(await gameServer.finishChallenge(getCookie("gameId"), challengeData)))
  }
}
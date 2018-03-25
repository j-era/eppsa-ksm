import omit from "lodash.omit"
import mapValues from "lodash.mapvalues"
import querystring from "querystring"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore, combineReducers } from "redux"
import { createLogger } from "redux-logger"

import Application from "./components/application"
import * as reducers from "./reducers"
import ContentServer from "./api/contentServer"
import { getCookie, setCookie } from "./cookie"
import GameServer from "./api/gameServer"
import * as actions from "./actionCreators"

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
  
  window.addEventListener("message", receiveMessage, false);

  const maxChallenges = Object.keys(content.challenges).length - 1

  render(
    <Provider store={ store }>
      <Application
        content={ content }
        previousGame={ previousGame }
        assetServerUri={ process.env.ASSET_SERVER_URI }
        onResumeGame={ onResumeGame.bind(this, gameId, maxChallenges) }
        onStartNewGame={ onStartNewGame.bind(this, maxChallenges) }
        onUpdateName={ (name) => store.dispatch(actions.updateName(name)) }
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

async function onResumeGame(gameId, maxChallenges) {
  store.dispatch(actions.updateGame(await gameServer.resumeGame(gameId, maxChallenges)))
}

async function onStartNewGame(maxChallenges, name, avatar) {
  console.log("Starting new game")
  const game = await gameServer.newGame(name, avatar, maxChallenges)
  store.dispatch(actions.updateGame(game))
  setCookie("gameId", game.gameId)
}

async function onStartChallenge() {
  await gameServer.startChallenge()
  store.dispatch(actions.startChallenge())
}

async function onChallengeReady(challengeWindow, config, uri) {
  challengeWindow.postMessage(config, uri)
}

async function receiveMessage(event)
{
  if(event.data.source === "challenge") { // ignore react dev tool messages
    const challengeData = omit(event.data, "source")
    store.dispatch(actions.updateGame(await gameServer.finishChallenge(challengeData)))
  }
}

gameServer.socket.on("activeGamesUpdated", async(activeGames) => {
  store.dispatch(actions.updateActiveGames(activeGames))
})

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

const store = applyMiddleware(createLogger())(createStore)(combineReducers(reducers))
const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)
const gameServer = new GameServer(process.env.GAME_SERVER_URI)

const config = querystring.parse(window.location.search.substring(1))

contentServer.getData().then(transform).then(async (content) => {
  let resumableGame = null
  const gameId = getCookie("gameId")
  if (gameId) {
    const game = await gameServer.findGame(gameId)

    if (game && !game.finished) {
      resumableGame = game
    }
  }

  window.addEventListener("message", receiveMessage, false)

  const maxChallenges = Object.keys(content.challenges).length - 1

  const selectedAvatar = config.avatar ? config.avatar : Object.keys(content.avatars)[0]
  store.dispatch(actions.updateAvatar(selectedAvatar))

  let showLobbyNavigation = false
  if (config.token) {
    if (resumableGame) {
      onResumeGame()
    } else {
      showLobbyNavigation = true
    }
  }

  render(
    <Provider store={ store }>
      <Application
        content={ content }
        showLobbyNavigation={ showLobbyNavigation }
        resumableGame={ resumableGame }
        assetServerUri={ process.env.ASSET_SERVER_URI }
        maxChallenges={ maxChallenges }
        onResumeGame={ onResumeGame }
        onStartNewGame={ onStartNewGame }
        onUpdateName={ (name) => store.dispatch(actions.updateName(name)) }
        onScan={ onScan }
        toggleQrReader={ toggleQrReader }
        handleQrReaderError={ handleQrReaderError }
        startChallenge={ startChallenge }
        onChallengeReady={ onChallengeReady } />
    </Provider>,
    document.getElementById("app")
  )

  async function onResumeGame() {
    store.dispatch(actions.updateGame(await gameServer.resumeGame(gameId, maxChallenges)))
    gameServer.setHandshakeQuery({ gameId })
  }

  async function onStartNewGame(name, avatar) {
    console.log("Starting new game")
    const game = await gameServer.newGame(name, avatar, maxChallenges)
    store.dispatch(actions.updateGame(game))
    setCookie("gameId", game.gameId)
    gameServer.setHandshakeQuery({ gameId: game.gameId })
  }

  function onScan(data, challengeNumber) {
    if (data != null && data === content.challenges[challengeNumber].token) {
      startChallenge()
      store.dispatch(actions.toggleQrReader())
    }
  }

  function toggleQrReader() {
    store.dispatch(actions.toggleQrReader())
  }

  function handleQrReaderError(error) {
    store.dispatch(actions.handleQrReaderError(error.name))
    console.error(error)
  }
})

function transform(content) {
  return Object.assign(mapValues(omit(content, "index"), transform), content.index)
}

async function startChallenge() {
  await gameServer.startChallenge()
  store.dispatch(actions.startChallenge())
}

async function onChallengeReady(challengeWindow, config, uri) {
  challengeWindow.postMessage(config, uri)
}

async function receiveMessage(event) {
  if (event.data.source === "challenge") { // ignore react dev tool messages
    console.log(`Challenge message received: ${JSON.stringify(event.data)}`)

    const challengeData = omit(event.data, "source")
    store.dispatch(actions.updateGame(await gameServer.finishChallenge(challengeData)))
  }
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

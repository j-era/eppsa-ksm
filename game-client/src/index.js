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
  const resumableGame = await findResumableGame()
  const showLobbyNavigation = config.token && !resumableGame
  const maxChallenges = Object.keys(content.challenges).length - 1

  const selectedAvatar = config.avatar ? config.avatar : Object.keys(content.avatars)[0]
  store.dispatch(actions.updateAvatar(selectedAvatar))

  window.addEventListener("message", receiveMessage, false)

  if (config.token && resumableGame) {
    resumeGame()
  }

  render(
    <Provider store={ store }>
      <Application
        content={ content }
        showLobbyNavigation={ showLobbyNavigation }
        resumableGame={ resumableGame }
        assetServerUri={ process.env.ASSET_SERVER_URI }
        contentServerUri={ process.env.CONTENT_SERVER_URI }
        gameServerUri={ process.env.GAME_SERVER_URI }
        maxChallenges={ maxChallenges }
        onResumeGame={ resumeGame }
        onStartNewGame={ startNewGame }
        onUpdateName={ (name) => store.dispatch(actions.updateName(name)) }
        onToggleQrReader={ toggleQrReader }
        onHandleQrReaderData={ handleQrReaderData }
        onHandleQrReaderError={ handleQrReaderError }
        onStartChallenge={ startChallenge }
        onChallengeReady={ onChallengeReady } />
    </Provider>,
    document.getElementById("app")
  )

  async function resumeGame() {
    store.dispatch(actions.updateGame(
      await gameServer.resumeGame(resumableGame.gameId)
    ))
    gameServer.setHandshakeQuery({ gameId: resumableGame.gameId })
  }

  async function startNewGame(name, avatar) {
    console.log("Starting new game")
    const game = await gameServer.startGame(name, avatar, maxChallenges)
    store.dispatch(actions.updateGame(game))
    setCookie("gameId", game.gameId)
    gameServer.setHandshakeQuery({ gameId: game.gameId })
  }

  function handleQrReaderData(data, challengeNumber) {
    if (data != null && data === content.challenges[challengeNumber].token) {
      startChallenge()
      store.dispatch(actions.toggleQrReader())
    }
  }
})

function toggleQrReader() {
  store.dispatch(actions.toggleQrReader())
}

function handleQrReaderError(error) {
  store.dispatch(actions.handleQrReaderError(error.name))
  console.error(error)
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

function transform(content) {
  return Object.assign(mapValues(omit(content, "index"), transform), content.index)
}

async function startChallenge() {
  await gameServer.startChallenge()
  store.dispatch(actions.startChallenge())
}

async function onChallengeReady(challengeWindow, config, uri) {
  challengeWindow.postMessage({ data: config, type: "challengeData" }, uri)
  activateDeviceOrientation(challengeWindow, config.challenge.template, uri)
}

function activateDeviceOrientation(challengeWindow, template, uri) {
  const gyroGames = ["button", "skill"]
  if (gyroGames.indexOf(template) >= 0) {
    window.addEventListener("deviceorientation", event => {
      console.log(event)
      challengeWindow.postMessage({
        data: {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        },
        type: "deviceOrientation"
      }, uri)
    })
  }
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

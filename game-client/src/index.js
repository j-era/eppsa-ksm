import omit from "lodash.omit"
import mapValues from "lodash.mapvalues"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import thunk from "redux-thunk"
import { applyMiddleware, createStore, combineReducers } from "redux"
import { createLogger } from "redux-logger"
import { ThemeProvider } from "styled-components"
import { injectGlobalStyle, calculateTheme } from "eppsa-ksm-shared"

import Application from "./components/application"
import * as gameStates from "./gameStates"
import * as reducers from "./reducers"
import ContentServer from "./api/contentServer"
import * as actions from "./actionCreators"

const store = createStore(combineReducers(reducers), applyMiddleware(thunk, createLogger()))
const contentServer = new ContentServer(process.env.CONTENT_SERVER_URI)

injectGlobalStyle(process.env.STATIC_SERVER_URI)

const CARD_RATIO = 2 / 3

contentServer.getData().then(transform).then(async (content) => {
  const maxChallenges = Object.keys(content.challenges).length - 1

  const resumableGame = await findResumableGame()
  if (resumableGame) {
    store.dispatch(actions.updateGameState(gameStates.RESUME_OR_NEW_GAME_SELECTION))
  } else {
    store.dispatch(actions.updateGameState(gameStates.INITIAL_GAME_MANUAL))
  }

  window.addEventListener("message", receiveMessage, false)

  const largeCardWidth = calculateCardWidth(0.95, 0.8, CARD_RATIO)
  const smallCardWidth = calculateCardWidth(0.95, 0.7, CARD_RATIO)
  const theme = calculateTheme(largeCardWidth, smallCardWidth, CARD_RATIO)

  render(
    <Provider store={ store }>
      <ThemeProvider theme={ theme }>
        <Application
          content={ content }
          resumableGame={ resumableGame }
          assetServerUri={ process.env.ASSET_SERVER_URI }
          contentServerUri={ process.env.CONTENT_SERVER_URI }
          gameServerUri={ process.env.GAME_SERVER_URI }
          staticServerUri={ process.env.STATIC_SERVER_URI }
          maxChallenges={ maxChallenges }
          dispatch={ store.dispatch }
          onChallengeReady={ onChallengeReady } />
      </ThemeProvider>
    </Provider>,
    document.getElementById("app")
  )
})

function transform(content) {
  return Object.assign(mapValues(omit(content, "index"), transform), content.index)
}

async function findResumableGame() {
  const resumableGame = JSON.parse(localStorage.getItem("gameData"))
  return !resumableGame.finished ? resumableGame : null
}

function calculateCardWidth(maxWidth, maxHeight) {
  const winRatio = window.innerWidth * maxWidth / (window.innerHeight * maxHeight)
  return winRatio < CARD_RATIO ? maxWidth * 100 : maxWidth * (CARD_RATIO / winRatio) * 100
}

async function onChallengeReady(challengeWindow, data, uri) {
  challengeWindow.postMessage({ data, type: "challengeData" }, uri)
  activateDeviceOrientation(challengeWindow, data.challenge.template, uri)
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

function receiveMessage(event) {
  if (event.data.source === "challenge") { // ignore react dev tool messages
    console.log(`Challenge message received: ${JSON.stringify(event.data)}`)
    const challengeData = omit(event.data, "source")

    switch (event.data.id) {
      case "finish": return store.dispatch(actions.finishChallenge(challengeData))
      case "addScore": return store.dispatch(actions.addScore(event.data.score))
      case "showTimeline": return store.dispatch(actions.showTimeline(event.data.startTime))
      case "startTimelineClock": return store.dispatch(actions.startTimelineClock())
      case "stopTimelineClock": return store.dispatch(actions.stopTimelineClock())
      case "hideTimeline": return store.dispatch(actions.hideTimeline())
    }
  }
}

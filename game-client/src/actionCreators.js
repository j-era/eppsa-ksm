import { delay } from "eppsa-ksm-shared"

import * as gameStates from "./gameStates"
import * as types from "./actionTypes"

export function resumeGame(resumableGame) {
  return async (dispatch) => {
    dispatch(updateGameData(resumableGame))

    dispatch(setMaxChallenges())

    dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
  }
}

export function startChallenge() {
  return async (dispatch) => {
    dispatch(updateGameState(gameStates.CHALLENGE))
  }
}

export function finishChallenge(challengeData) {
  return async (dispatch, getState) => {
    if (challengeData.score != null) {
      dispatch(addScore(challengeData.score))
      await delay(3000)
    }

    const result = getState().challengeData.challenge.result

    const { gameId, score, playerType } = getState()
    const challengeNumber = getState().challengeNumber + 1
    const data = { gameId, challengeNumber, score, playerType }

    data.finished = challengeNumber > getState().maxChallenges

    dispatch(updateGameData(data))
    sendTrackingData({ gameId, ...data })

    if (result) {
      dispatch(updateGameState(gameStates.CHALLENGE_RESULT))
    } else {
      dispatch(showNextAreaOrFinishGame())
    }
  }
}

export function showNextAreaOrFinishGame() {
  return async (dispatch, getState) => {
    const { finished } = getState()

    if (finished) {
      dispatch(updateGameState(gameStates.FINISHED))
    } else {
      dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
    }
  }
}

function sendTrackingData(data) {
  fetch(process.env.TRACKER_SERVER_URI, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data)
  })
}

export function addScore(increment) {
  return async (dispatch, getState) => {
    dispatch({ type: types.ADD_SCORE, increment, score: getState().score })
    dispatch({ type: types.SHOW_SCORE })
    await delay(3000)
    dispatch({ type: types.HIDE_SCORE })
  }
}

export function startNewGame(playerType) {
  return async dispatch => {
    dispatch(setPlayerType(playerType))

    dispatch(setMaxChallenges())

    const data = { challengeNumber: 1, score: 0, finished: false, playerType }
    dispatch(updateGameData(data))

    dispatch(updateGameState(gameStates.INITIAL_GAME_MANUAL))
  }
}

export function setPlayerType(playerType) {
  return {
    type: types.SET_PLAYER_TYPE,
    playerType
  }
}

export function setMaxChallenges() {
  return (dispatch, getState) => {
    const { content, playerType } = getState()
    const maxChallenges = Object.values(content[playerType])
      .filter(value => value.template && value.template === "challenge")
      .length
    dispatch({
      type: types.SET_MAX_CHALLENGES,
      maxChallenges
    })
  }
}

export function updateContent(content) {
  return {
    type: types.UPDATE_CONTENT,
    content
  }
}

export function updateGameData(data) {
  localStorage.setItem("gameData", JSON.stringify(data))
  return {
    type: types.UPDATE_GAME_DATA,
    data
  }
}

export function updateGameState(gameState) {
  return (dispatch, getState) => {
    const { playerType, challengeNumber, content } = getState()

    switch (gameState) {
      case gameStates.AREA_CONFIRMATION:
        dispatch(updateAreaColor(content[playerType][challengeNumber].color))
        break
      case gameStates.FINISHED:
        dispatch(updateAreaColor(content.shared.colors.primary))
        break
    }

    dispatch({
      type: types.UPDATE_GAME_STATE,
      state: gameState
    })
  }
}

export function setShowGameManual(show) {
  return {
    type: types.SHOW_GAME_MANUAL,
    show
  }
}

export function showTimeline(startTime) {
  console.log(`showTimeline ${startTime}`)
  return {
    type: types.SHOW_TIMELINE,
    startTime
  }
}

export function startTimelineClock() {
  console.log("startTimeClock")
  return {
    type: types.START_TIMELINE_CLOCK
  }
}

export function stopTimelineClock() {
  console.log("stopTimelineClock")
  return {
    type: types.STOP_TIMELINE_CLOCK
  }
}

export function hideTimeline() {
  console.log("hideTimeline")
  return {
    type: types.HIDE_TIMELINE
  }
}

export function updateAreaColor(color) {
  return {
    type: types.UPDATE_AREA_COLOR,
    areaColor: color
  }
}

export function confirmArea() {
  return async (dispatch, getState) => {
    const { challengeNumber, content, playerType } = getState()
    const challenge = playerType && challengeNumber ? content[playerType][challengeNumber] : null
    const challengeTypeData = challenge.challenge
    const challengeUri = resolveChallengeWebAppUri(challengeTypeData.template)
    const challengeData = {
      color: challenge.color,
      challenge: challengeTypeData,
      shared: content.shared,
      staticServerUri: process.env.STATIC_SERVER_URI,
      assetServerUri: process.env.ASSET_SERVER_URI
    }

    dispatch({ type: types.SET_CHALLENGE_TYPE, challengeData, challengeUri })
    dispatch(updateGameState(gameStates.CHALLENGE_MANUAL))
  }
}

function resolveChallengeWebAppUri(webApp) {
  const protocol = document.location.protocol
  const environment = document.location.hostname.split(".").slice(1).join(".")
  const challengeUri = new URL(`${protocol}//${webApp}.${environment}`)

  return challengeUri.toString()
}

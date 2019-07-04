import { delay } from "eppsa-ksm-shared"

import * as gameStates from "./gameStates"
import * as types from "./actionTypes"

export function resumeGame(resumableGame) {
  return async (dispatch) => {
    dispatch(updateGameData(resumableGame))
    dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
  }
}

export function startNewGame() {
  return async (dispatch) => {
    const data = { challengeNumber: 1, score: 0, finished: false }
    dispatch(updateGameData(data))
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

    const challengeNumber = getState().challengeNumber + 1
    const score = getState().score

    const data = { challengeNumber, score }

    // Get max challenge number from content or calculate
    if (challengeNumber > getState().maxChallenges) {
      data.finished = true
      dispatch(updateGameState(gameStates.FINISHED))
    } else {
      data.finished = false
      dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
    }

    const gameId = getState().gameId

    fetch(process.env.TRACKER_SERVER_URI, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ gameId, ...data })
    })

    dispatch(updateGameData(data))
  }
}

export function addScore(increment) {
  return async (dispatch, getState) => {
    dispatch({ type: types.ADD_SCORE, increment, score: getState().score })
    dispatch({ type: types.SHOW_SCORE })
    await delay(3000)
    dispatch({ type: types.HIDE_SCORE })
  }
}

export function setMaxChallenges(maxChallenges) {
  return {
    type: types.SET_MAX_CHALLENGES,
    maxChallenges
  }
}

export function updateGameData(data) {
  localStorage.setItem("gameData", JSON.stringify(data))
  return {
    type: types.UPDATE_GAME_DATA,
    data
  }
}

export function updateGameState(state) {
  return {
    type: types.UPDATE_GAME_STATE,
    state
  }
}

export function showGameManual(show) {
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

export function confirmArea(content) {
  return async (dispatch, getState) => {
    const { challengeNumber } = getState()

    const challengeTypeData = content.challenges[challengeNumber].challenge
    const challengeUri = resolveChallengeWebAppUri(challengeTypeData.template)
    const challengeData = {
      color: content.challenges[challengeNumber].color,
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

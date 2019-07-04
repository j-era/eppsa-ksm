import pickBy from "lodash.pickby"
import uniq from "lodash.uniq"
import omitBy from "lodash.omitby"
import omit from "lodash.omit"
import isEmpty from "lodash.isempty"

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

    const gameID = getState().gameID

    fetch(process.env.TRACKER_SERVER_URI, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameID, ...data })
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

export function selectChallengeType(name, content) {
  return async (dispatch, getState) => {
    const { challengeNumber } = getState()

    const challengeTypeData = content.challenges[challengeNumber].challengeTypes[name]
    const challengeUri = resolveChallengeWebAppUri(challengeTypeData.template)
    const challengeData = {
      color: content.challenges[challengeNumber].color,
      challenge: challengeTypeData,
      shared: content.shared,
      staticServerUri: process.env.STATIC_SERVER_URI,
      assetServerUri: process.env.ASSET_SERVER_URI
    }

    dispatch({ type: types.SET_CHALLENGE_TYPE, challengeData, challengeUri })
  }
}

function resolveChallengeWebAppUri(webApp) {
  const protocol = document.location.protocol
  const environment = document.location.hostname.split(".").slice(1).join(".")
  const challengeUri = new URL(`${protocol}//${webApp}.${environment}`)

  return challengeUri.toString()
}

export function selectChallengeOrMode(content) {
  return async (dispatch, getState) => {
    const hasMultiplayerChallenge = !isEmpty(pickBy(
      content.challenges[getState().challengeNumber].challengeTypes,
      "multiplayer"
    ))

    if (hasMultiplayerChallenge) {
      dispatch(updateGameState(gameStates.CHALLENGE_MODE_SELECTION))
    } else {
      dispatch(selectRandomChallengeType(content))
    }
  }
}

export function selectRandomChallengeType(content) {
  return (dispatch, getState) => {
    const challenges = omitBy(
      omit(content.challenges[getState().challengeNumber].challengeTypes, "template"),
      (challenge) => challenge.multiplayer
    )

    const challengeName = chooseRandomChallenge(challenges)
    dispatch(
      selectChallengeType(challengeName, content)
    )
    dispatch(updateGameState(gameStates.CHALLENGE_SELECTION))
  }
}

export function selectMultiplayerChallengeType(content) {
  return (dispatch, getState) => {
    const multiplayerChallenges = Object.keys(pickBy(
      content.challenges[getState().challengeNumber].challengeTypes,
      "multiplayer"
    ))

    const challengeName = multiplayerChallenges[0]

    dispatch(
      selectChallengeType(challengeName, content)
    )
    dispatch(updateGameState(gameStates.CHALLENGE_MANUAL))
  }
}

function chooseRandomChallenge(challenges) {
  const templates = uniq(Object.values(challenges).map(challenge => challenge.template))
  const randomTemplate = random(templates)

  const names = Object.keys(
    pickBy(challenges, challenge => challenge.template === randomTemplate)
  )

  return random(names)
}

function random(array) {
  return array[Math.floor(Math.random() * array.length)]
}

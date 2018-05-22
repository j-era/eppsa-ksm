import uuid from "uuid/v4"
import pickBy from "lodash.pickby"
import uniq from "lodash.uniq"
import omitBy from "lodash.omitby"
import omit from "lodash.omit"
import isEmpty from "lodash.isempty"

import { delay } from "eppsa-ksm-shared"

import { setCookie } from "./cookie"
import * as gameStates from "./gameStates"
import * as types from "./actionTypes"
import * as messages from "./messages"

export function resumeGame(gameId, gameServer) {
  return async (dispatch) => {
    const data = await gameServer.resumeGame(gameId)
    dispatch(updateGameData(data))
    dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_AREA))
    gameServer.setHandshakeQuery({ gameId })
  }
}

export function configureNewGame() {
  return (dispatch, getState) => {
    if (getState().avatar) {
      dispatch(updateGameState(gameStates.NEW_GAME_NAME_SELECTION))
    } else {
      dispatch(updateGameState(gameStates.NEW_GAME_AVATAR_SELECTION))
    }
  }
}

export function startNewGame(name, avatar, maxChallenges, gameServer) {
  return async (dispatch) => {
    const data = await gameServer.startGame(name, avatar, maxChallenges)
    dispatch(updateGameData(data))
    dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_AREA))

    setCookie("gameId", data.gameId)
    gameServer.setHandshakeQuery({ gameId: data.gameId })
  }
}

export function startChallengeOrLobby(gameServer, room = null) {
  return async (dispatch, getState) => {
    const isMultiplayerChallenge = getState().challengeData.challenge.multiplayer
    if (isMultiplayerChallenge) {
      dispatch(joinChallengeLobby(gameServer))
    } else {
      dispatch(startChallenge(gameServer, room))
    }
  }
}

export function startChallenge(gameServer, room = null) {
  return async (dispatch) => {
    await gameServer.startChallenge()
    dispatch({ type: types.SET_CHALLENGE_ROOM, room })
    dispatch(updateGameState(gameStates.CHALLENGE))
  }
}

export function finishChallenge(challengeData, gameServer) {
  return async (dispatch, getState) => {
    if (challengeData.score != null) {
      dispatch(addScore(challengeData.score))
      await delay(3000)
    }

    const data = await gameServer.finishChallenge({ ...challengeData, score: getState().score })

    if (data.finished) {
      dispatch(updateGameState(gameStates.FINISHED))
    } else {
      dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_AREA))
    }

    dispatch(updateGameData(data))
  }
}

export function addScore(increment) {
  return async (dispatch) => {
    dispatch({ type: types.SHOW_SCORE })
    dispatch({ type: types.ADD_SCORE, increment })
    await delay(3000)
    dispatch({ type: types.HIDE_SCORE })
  }
}

export function updateAvatar(avatar) {
  return {
    type: types.UPDATE_AVATAR,
    avatar
  }
}

export function updateGameData(data) {
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

export function updateConnectedGames(games) {
  return {
    type: types.UPDATE_CONNECTED_GAMES,
    games
  }
}

export function updateName(name) {
  return {
    type: types.UPDATE_NAME,
    name
  }
}

export function showGameManual(show) {
  return {
    type: types.SHOW_GAME_MANUAL,
    show
  }
}

export function updateConnected(connected) {
  return {
    type: types.UPDATE_CONNECTED,
    connected
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

export function joinChallengeLobby(gameServer) {
  return async (dispatch) => {
    gameServer.joinChallengeLobby()
    dispatch(updateGameState(gameStates.CHALLENGE_LOBBY))
  }
}

export function leaveChallengeLobby(gameServer) {
  return async (dispatch) => {
    gameServer.leaveChallengeLobby()
    dispatch(updateGameState(gameStates.CHALLENGE_MODE_SELECTION))
  }
}

export function requestMate(gameId, name, gameServer) {
  return async (dispatch) => {
    gameServer.sendToPeer(messages.REQUEST_MATE, gameId)

    dispatch({
      type: types.REQUEST_MATE,
      gameId,
      name
    })
  }
}

export function cancelRequestMate(gameServer) {
  return async (dispatch, getState) => {
    gameServer.sendToPeer(messages.CANCEL_REQUEST_MATE, getState().requestedMate.gameId)

    dispatch({
      type: types.CANCEL_REQUEST_MATE
    })
  }
}

export function acceptMate(gameId, gameServer) {
  return async (dispatch) => {
    const room = uuid()
    gameServer.sendToPeer(messages.ACCEPT_MATE, gameId, room)
    gameServer.leaveChallengeLobby()

    dispatch(startChallenge(gameServer, room))
  }
}

export function declineMate(gameId, gameServer) {
  return async (dispatch) => {
    gameServer.sendToPeer(messages.DECLINE_MATE, gameId)

    dispatch({
      type: types.DECLINE_MATE,
      gameId
    })
  }
}

export function handleIncomingMateRequest(gameId) {
  return {
    type: types.INCOMING_REQUEST_MATE,
    gameId
  }
}

export function handleIncomingCancelMateRequest(gameId) {
  return {
    type: types.INCOMING_CANCEL_REQUEST_MATE,
    gameId
  }
}

export function handleIncomingAcceptMate(gameId, room, gameServer) {
  return async (dispatch, getState) => {
    if (getState().requestedMate.gameId === gameId) {
      gameServer.leaveChallengeLobby()

      dispatch(startChallenge(gameServer, room))
    }
  }
}

export function handleIncomingDeclineMate() {
  return {
    type: types.INCOMING_DECLINE_MATE
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
      assetServerUri: process.env.ASSET_SERVER_URI,
      gameServerUri: process.env.GAME_SERVER_URI
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

export function handleChallengeQrCode(data, challenge) {
  return (dispatch) => {
    if (data != null) {
      const url = new URL(data)
      const token = url.searchParams.get("token")
      if (token === challenge.token) {
        dispatch({ type: types.CORRECT_QR_CODE_SCANNED })
        dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
      } else {
        dispatch({ type: types.WRONG_QR_CODE_SCANNED })
      }
    }
  }
}

export function handleChallengeCode(challengeCode, challenge) {
  return dispatch => {
    if (challengeCode === challenge.token) {
      dispatch({ type: types.CORRECT_CHALLENGE_CODE_ENTERED })
      setTimeout(() => {
        dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
      }, 500)
    } else {
      dispatch({ type: types.WRONG_CHALLENGE_CODE_ENTERED })
    }
  }
}

export function handleAvatarQrCode(data) {
  return dispatch => {
    if (data != null) {
      const url = new URL(data)
      const avatar = url.searchParams.get("avatar")
      if (avatar != null) {
        dispatch(updateAvatar(avatar))
        dispatch(updateGameState(gameStates.NEW_GAME_NAME_SELECTION))
      } else {
        dispatch({ type: types.WRONG_QR_CODE_SCANNED })
      }
    }
  }
}

export function handleQrReaderError(name) {
  return {
    type: types.HANDLE_QR_READER_ERROR,
    name
  }
}

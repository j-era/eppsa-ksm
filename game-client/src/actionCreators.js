import uuid from "uuid/v4"

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

export function startChallenge(gameServer, room = null) {
  return async (dispatch) => {
    await gameServer.startChallenge()
    dispatch({ type: types.SET_CHALLENGE_ROOM, room })
    dispatch(updateGameState(gameStates.CHALLENGE))
  }
}

export function finishChallenge(challengeData, gameServer) {
  return async (dispatch, getState) => {
    if (challengeData.score) {
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
    dispatch({ type: types.ADD_SCORE, increment })
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

export function selectChallengeType(
  name,
  content,
  assetServerUri,
  gameServerUri,
  staticServerUri
) {
  return async (dispatch, getState) => {
    const { challengeNumber } = getState()

    const challengeTypeData = content.challenges[challengeNumber].challengeTypes[name]
    const challengeUri = resolveChallengeWebAppUri(challengeTypeData.template)
    const challengeData = {
      color: content.challenges[challengeNumber].color,
      challenge: challengeTypeData,
      shared: content.shared,
      staticServerUri,
      assetServerUri,
      gameServerUri
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

export function selectChallengeMode(content, gameServer) {
  return async (dispatch, getState) => {
    const { challengeData } = getState()
    if (challengeData.challenge.multiplayer) {
      dispatch(updateGameState(gameStates.CHALLENGE_MODE_SELECTION))
    } else {
      dispatch(startChallenge(gameServer))
    }
  }
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

import querystring from "querystring"
import uuid from "uuid/v4"

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
  return async (dispatch) => {
    const data = await gameServer.finishChallenge(challengeData)

    if (data.finished) {
      dispatch(updateGameState(gameStates.FINISHED))
    } else {
      dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_AREA))
    }

    dispatch(updateGameData(data))
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

export function requestMate(gameId, gameServer) {
  return async (dispatch) => {
    gameServer.sendToPeer(messages.REQUESTING_MATE, gameId)

    dispatch({
      type: types.REQUEST_MATE,
      gameId
    })
  }
}

export function cancelRequestMate(gameServer) {
  return async (dispatch, getState) => {
    gameServer.sendToPeer(messages.CANCEL_REQUESTING_MATE, getState().requestedMate.gameId)

    dispatch({
      type: types.CANCEL_REQUEST_MATE
    })
  }
}

export function acceptMateRequest(gameId, gameServer) {
  return async (dispatch) => {
    const room = uuid()
    gameServer.sendToPeer(messages.ACCEPTING_MATE, gameId, room)
    gameServer.leaveChallengeLobby()
    dispatch(startChallenge(gameServer, room))
  }
}

export function rejectMateRequest(gameId, gameServer) {
  return async (dispatch) => {
    gameServer.sendToPeer(messages.REJECTING_MATE, gameId)

    dispatch({
      type: types.REJECT_MATE,
      gameId
    })
  }
}

export function handleIncomingMateRequest(gameId) {
  return {
    type: types.INCOMING_MATE_REQUEST,
    gameId
  }
}

export function handleIncomingCancelMateRequest(gameId) {
  return {
    type: types.INCOMING_CANCEL_MATE_REQUEST,
    gameId
  }
}

export function handleIncomingMateAccept(gameId, room, gameServer) {
  return async (dispatch, getState) => {
    if (getState().requestedMate.gameId === gameId) {
      gameServer.leaveChallengeLobby()
      dispatch(startChallenge(gameServer, room))
    }
  }
}

export function handleIncomingMateReject() {
  return {
    type: types.INCOMING_MATE_REJECT
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
      if (data === challenge.token) {
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
      const params = querystring.parse(url.search.substring(1))
      if (params.avatar != null) {
        dispatch(updateAvatar(params.avatar))
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

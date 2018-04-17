import { setCookie } from "./cookie"
import * as gameStates from "./gameStates"
import * as types from "./actionTypes"
import * as messages from "./messages"

export function resumeGame(gameId, gameServer) {
  return async (dispatch) => {
    const data = await gameServer.resumeGame(gameId)
    dispatch(updateGameData(data))
    dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_CHALLENGE))
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
    dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_CHALLENGE))
    dispatch(showGameManual(true))

    setCookie("gameId", data.gameId)
    gameServer.setHandshakeQuery({ gameId: data.gameId })
  }
}

export function startChallenge(gameServer) {
  return async (dispatch) => {
    await gameServer.startChallenge()
    dispatch(updateGameState(gameStates.CHALLENGE))
  }
}

export function finishChallenge(challengeData, gameServer) {
  return async (dispatch) => {
    const data = await gameServer.finishChallenge(challengeData)

    if (data.finished) {
      dispatch(updateGameState(gameStates.FINISHED))
    } else {
      dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_CHALLENGE))
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
    gameServer.sendDirectMessage(messages.REQUESTING_MATE, gameId)

    dispatch({
      type: types.REQUEST_MATE,
      gameId
    })
  }
}

export function cancelRequestMate(gameServer) {
  return async (dispatch, getState) => {
    gameServer.sendDirectMessage(messages.CANCEL_REQUESTING_MATE, getState().requestedMate)

    dispatch({
      type: types.CANCEL_REQUEST_MATE
    })
  }
}

export function acceptMateRequest(gameId, gameServer) {
  return async (dispatch) => {
    gameServer.sendDirectMessage(messages.ACCEPTING_MATE, gameId)
    dispatch(startChallenge(gameServer))
  }
}

export function rejectMateRequest(gameId, gameServer) {
  return async (dispatch) => {
    gameServer.sendDirectMessage(messages.REJECTING_MATE, gameId)

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

export function handleIncomingMateAccept(gameId, gameServer) {
  return async (dispatch, getState) => {
    if (getState().requestedMate === gameId) {
      dispatch(startChallenge(gameServer))
    }
  }
}

export function handleIncomingMateReject() {
  return {
    type: types.INCOMING_MATE_REJECT
  }
}

export function handleChallengeQrCode(data, challenge) {
  return (dispatch) => {
    if (data != null) {
      if (data === challenge.token) {
        dispatch({ type: types.CORRECT_QR_CODE_SCANNED })

        if (challenge.multiplayer) {
          dispatch(updateGameState(gameStates.CHALLENGE_MODE_SELECTION))
        } else {
          dispatch(updateGameState(gameStates.CHALLENGE_MANUAL))
        }
      } else {
        dispatch({ type: types.WRONG_QR_CODE_SCANNED })
        dispatch(updateGameState(gameStates.NAVIGATION_TO_NEXT_CHALLENGE))
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

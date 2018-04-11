import { setCookie } from "./cookie"
import * as gameStates from "./gameStates"
import * as types from "./actionTypes"

export function resumeGame(gameId, gameServer) {
  return async (dispatch) => {
    const data = await gameServer.resumeGame(gameId)
    dispatch(updateGameData(data))
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

export function handleChallengeQrCode(data, challenge) {
  return (dispatch) => {
    if (data != null && data === challenge.token) {
      if (challenge.multiplayer) {
        dispatch(updateGameState(gameStates.CHALLENGE_MODE_SELECTION))
      } else {
        dispatch(updateGameState(gameStates.CHALLENGE_MANUAL))
      }
    } else {
      dispatch({ type: types.WRONG_QR_CODE_SCANNED })
    }
  }
}

export function handleQrReaderError(name) {
  return {
    type: types.HANDLE_QR_READER_ERROR,
    name
  }
}

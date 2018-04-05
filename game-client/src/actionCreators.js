import * as types from "./actionTypes"

export function updateAvatar(avatar) {
  return {
    type: types.UPDATE_AVATAR,
    avatar
  }
}

export function updateGame(game) {
  return {
    type: types.UPDATE_GAME,
    game
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

export function startChallenge() {
  return {
    type: types.START_CHALLENGE
  }
}

export function updateConnected(connected) {
  return {
    type: types.UPDATE_CONNECTED,
    connected
  }
}

export function toggleQrReader() {
  return {
    type: types.TOGGLE_QR_READER
  }
}

export function handleQrReaderError(name) {
  return {
    type: types.HANDLE_QR_READER_ERROR,
    name
  }
}

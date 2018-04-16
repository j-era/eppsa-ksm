import * as gameStates from "./gameStates"
import * as types from "./actionTypes"

export function gameState(state = gameStates.NEW_GAME_AVATAR_SELECTION, action) {
  switch (action.type) {
    case types.UPDATE_GAME_STATE:
      return action.state
    default:
      return state
  }
}

export function gameId(state = null, action) {
  switch (action.type) {
    case types.UPDATE_GAME_DATA:
      return action.data.gameId
    default:
      return state
  }
}

export function name(state = "", action) {
  switch (action.type) {
    case types.UPDATE_GAME_DATA:
      return action.data.name
    case types.UPDATE_NAME:
      return action.name
    default:
      return state
  }
}

export function avatar(state = null, action) {
  switch (action.type) {
    case types.UPDATE_GAME_DATA:
      return action.data.avatar
    case types.UPDATE_AVATAR:
      return action.avatar
    default:
      return state
  }
}

export function challengeNumber(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_GAME_DATA:
      return action.data.challengeNumber
    default:
      return state
  }
}

export function score(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_GAME_DATA:
      return action.data.score
    default:
      return state
  }
}

export function showTimeline(state = false, action) {
  switch (action.type) {
    case types.SHOW_TIMELINE:
      return true
    case types.HIDE_TIMELINE:
      return false
    default:
      return state
  }
}

export function timelineClockTime(state = 0, action) {
  switch (action.type) {
    case types.SHOW_TIMELINE:
      return action.startTime
    default:
      return state
  }
}

export function timelineClockRunning(state = false, action) {
  switch (action.type) {
    case types.START_TIMELINE_CLOCK:
      return true
    case types.STOP_TIMELINE_CLOCK:
      return true
    default:
      return state
  }
}

export function connected(state = false, action) {
  switch (action.type) {
    case types.UPDATE_CONNECTED:
      return action.connected
    default:
      return state
  }
}

export function connectedGames(state = [], action) {
  switch (action.type) {
    case types.UPDATE_CONNECTED_GAMES:
      return action.games
    default:
      return state
  }
}

export function showGameManual(state = false, action) {
  switch (action.type) {
    case types.SHOW_GAME_MANUAL:
      return action.show
    default:
      return state
  }
}

export function wrongQrCodeScanned(state = false, action) {
  switch (action.type) {
    case types.WRONG_QR_CODE_SCANNED:
      return true
    case types.CORRECT_QR_CODE_SCANNED:
      return false
    default:
      return state
  }
}

export function cameraPermissonDenied(state = false, action) {
  switch (action.type) {
    case types.HANDLE_QR_READER_ERROR:
      return action.name === "NotAllowedError"
    default:
      return state
  }
}

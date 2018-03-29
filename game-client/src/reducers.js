import * as gameStates from "./gameStates"
import * as types from "./actionTypes"

export function gameState(state = gameStates.WELCOME, action) {
  switch (action.type) {
    case types.UPDATE_GAME:
      return action.game.finished ? gameStates.FINISHED : gameStates.RUNNING
    default:
      return state
  }
}

export function name(state = "Bob", action) {
  switch (action.type) {
    case types.UPDATE_GAME:
      return action.game.name
    case types.UPDATE_NAME:
      return action.name
    default:
      return state
  }
}

export function avatar(state = null, action) {
  switch (action.type) {
    case types.UPDATE_GAME:
      return action.game.avatar
    case types.UPDATE_AVATAR:
      return action.avatar
    default:
      return state
  }
}

export function challengeNumber(state = 1, action) {
  switch (action.type) {
    case types.UPDATE_GAME:
      return action.game.challengeNumber
    default:
      return state
  }
}

export function challengeStarted(state = false, action) {
  switch (action.type) {
    case types.UPDATE_GAME:
      return false
    case types.START_CHALLENGE:
      return true
    default:
      return state
  }
}

export function score(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_GAME:
      return action.game.score
    default:
      return state
  }
}

export function connectedGames(state = [], action) {
  switch (action.type) {
    case types.UPDATE_ACTIVE_GAMES:
      return action.games
    default:
      return state
  }
}

export function showQrReader(state = false, action) {
  switch (action.type) {
    case types.TOGGLE_QR_READER:
      return !state
    default:
      return state
  }
}

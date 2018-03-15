import * as types from "./actionTypes"

export function gameStarted(state = false, action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return true
    default:
      return state
  }
}

export function name(state = "Bob", action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return action.gameInfo.name
    case types.UPDATE_NAME:
      return action.name
    default:
      return state
  }
}

export function avatar(state = "flower", action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return action.gameInfo.avatar
    default:
      return state
  }
}

export function challenge(state = 1, action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return action.gameInfo.challenge
    default:
      return state
  }
}

export function challengeStarted(state = false, action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return false
    case types.START_CHALLENGE:
      return true
    default:
      return state
  }
}

export function score(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return action.gameInfo.score
    default:
      return state
  }
}
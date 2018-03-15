import * as types from "./actionTypes"

export function name(state = "", action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return action.gameInfo.name
    case types.UPDATE_NAME:
      return action.name
    default:
      return state
  }
}

export function avatar(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return action.gameInfo.avatar
    default:
      return state
  }
}

export function currentChallenge(state = 1, action) {
  switch (action.type) {
    case types.UPDATE_GAME_INFO:
      return action.gameInfo.currentChallenge
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
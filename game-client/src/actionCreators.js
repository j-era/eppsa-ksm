import * as types from "./actionTypes"

export function updateGameInfo(gameInfo) {
  return {
    type: types.UPDATE_GAME_INFO,
    gameInfo
  }
}

export function updateName(name) {
  return {
    type: types.UPDATE_NAME,
    name
  }
}

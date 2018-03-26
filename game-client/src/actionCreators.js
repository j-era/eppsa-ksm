import * as types from "./actionTypes"

export function updateGame(game) {
  return {
    type: types.UPDATE_GAME,
    game
  }
}

export function updateActiveGames(games) {
  return {
    type: types.UPDATE_ACTIVE_GAMES,
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

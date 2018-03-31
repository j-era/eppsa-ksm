import * as types from "./actionTypes"

export function recentFinishedGames(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_RECENT_FINISHED_GAMES:
      return action.games
    default:
      return state
  }
}

export function highscoreGames(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_HIGHSCORE_GAMES:
      return action.games
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

export function connected(state = false, action) {
  switch (action.type) {
    case types.UPDATE_CONNECTED:
      return action.connected
    default:
      return state
  }
}

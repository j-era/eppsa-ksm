import * as actionTypes from "./actionTypes"
import * as scoreModes from "./scoreModes"

export function scoreMode(state = scoreModes.ALL_TIME_HIGHSCORE, action) {
  switch (action.type) {
    case actionTypes.SET_SCORE_MODE:
      return action.scoreMode
    default:
      return state
  }
}

export function recentFinishedGames(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_RECENT_FINISHED_GAMES:
      return action.games
    default:
      return state
  }
}

export function highscoreGames(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_HIGHSCORE_GAMES:
      return action.games
    default:
      return state
  }
}

export function connectedGames(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_CONNECTED_GAMES:
      return action.games
    default:
      return state
  }
}

export function connected(state = false, action) {
  switch (action.type) {
    case actionTypes.UPDATE_CONNECTED:
      return action.connected
    default:
      return state
  }
}

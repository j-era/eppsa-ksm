import * as types from "./actionTypes"

export function setScoreMode(scoreMode) {
  return {
    type: types.SET_SCORE_MODE,
    scoreMode
  }
}

export function updateRecentFinishedGames(games) {
  return {
    type: types.UPDATE_RECENT_FINISHED_GAMES,
    games
  }
}

export function updateHighscoreGames(games) {
  return {
    type: types.UPDATE_HIGHSCORE_GAMES,
    games
  }
}

export function updateConnectedGames(games) {
  return {
    type: types.UPDATE_CONNECTED_GAMES,
    games
  }
}

export function updateConnected(connected) {
  return {
    type: types.UPDATE_CONNECTED,
    connected
  }
}

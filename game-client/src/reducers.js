import uuid from "uuid"

import * as types from "./actionTypes"
import * as gameStates from "./gameStates"

export function gameState(state = gameStates.PLAYER_TYPE_SELECTION, action) {
  switch (action.type) {
    case types.UPDATE_GAME_STATE:
      return action.state
    default:
      return state
  }
}

export function playerType(state = null, action) {
  switch (action.type) {
    case types.SET_PLAYER_TYPE:
      return action.playerType
    case types.UPDATE_GAME_DATA:
      return action.data.playerType
    default:
      return state
  }
}

export function content(state = null, action) {
  switch (action.type) {
    case types.UPDATE_CONTENT:
      return action.content
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

export function maxChallenges(state = 0, action) {
  switch (action.type) {
    case types.SET_MAX_CHALLENGES:
      return action.maxChallenges
    default:
      return state
  }
}

export function gameId(state = uuid()) {
  return state
}

export function challengeData(state = null, action) {
  switch (action.type) {
    case types.SET_CHALLENGE_TYPE:
      return action.challengeData
    default:
      return state
  }
}

export function challengeUri(state = null, action) {
  switch (action.type) {
    case types.SET_CHALLENGE_TYPE:
      return action.challengeUri
    default:
      return state
  }
}

export function oldScore(state = 0, action) {
  switch (action.type) {
    case types.ADD_SCORE:
      return action.score
    default:
      return state
  }
}

export function score(state = 0, action) {
  switch (action.type) {
    case types.UPDATE_GAME_DATA:
      return action.data.score
    case types.ADD_SCORE:
      return state + action.increment
    default:
      return state
  }
}

export function showScore(state = false, action) {
  switch (action.type) {
    case types.SHOW_SCORE:
      return true
    case types.HIDE_SCORE:
      return false
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
      return false
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

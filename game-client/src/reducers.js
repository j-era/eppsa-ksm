import * as types from "./actionTypes"
import * as gameStates from "./gameStates"
import * as requestedMateStates from "./requestedMateStates"

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

export function challengeRoom(state = null, action) {
  switch (action.type) {
    case types.SET_CHALLENGE_ROOM:
      return action.room
    default:
      return state
  }
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

const noRequestedMate = { gameId: null, requestState: requestedMateStates.NONE }

export function requestedMate(state = noRequestedMate, action) {
  switch (action.type) {
    case types.REQUEST_MATE:
      return { gameId: action.gameId, requestState: requestedMateStates.PENDING }
    case types.INCOMING_MATE_REJECT:
      return state.requestState === requestedMateStates.PENDING
        ? { gameId: state.gameId, requestState: requestedMateStates.REJECTED }
        : state
    case types.CANCEL_REQUEST_MATE:
      return noRequestedMate
    case types.UPDATE_CONNECTED:
      return state.requestState === requestedMateStates.PENDING
        ? { gameId: state.gameId, requestState: requestedMateStates.NOT_AVAILABLE }
        : state
    case types.UPDATE_CONNECTED_GAMES:
      return state.requestState === requestedMateStates.PENDING
        && !includesGame(state.gameId, action.games)
        ? { gameId: state.gameId, requestState: requestedMateStates.NOT_AVAILABLE }
        : state
    default:
      return state
  }
}

export function mateRequests(state = new Set(), action) {
  switch (action.type) {
    case types.INCOMING_MATE_REQUEST:
    {
      const newState = new Set(state)
      newState.add(action.gameId)
      return newState
    }
    case types.REJECT_MATE:
    {
      const newState = new Set(state)
      newState.delete(action.gameId)
      return newState
    }
    case types.INCOMING_CANCEL_MATE_REQUEST:
    {
      const newState = new Set(state)
      newState.delete(action.gameId)
      return newState
    }
    case types.UPDATE_CONNECTED:
      return new Set()
    case types.UPDATE_CONNECTED_GAMES:
      return new Set(Array.from(state).filter((gameId) => includesGame(gameId, action.games)))
    default:
      return state
  }
}

function includesGame(gameId, games) {
  return games.find((game) => game.gameId === gameId && game.inLobby)
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

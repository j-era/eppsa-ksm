import React from "react"

import {
  NONE,
  DECLINED,
  NOT_AVAILABLE
} from "../../../requestedMateStates"

import Lobby from "./lobby"
import MateRequestPending from "./mateRequestPending"
import RequestedMateDeclined from "./requestedMateDeclined"
import RequestedMatePending from "./requestedMatePending"
import RequestedMateUnavailable from "./requestedMateUnavailable"

export default function ChallengeLobby(props) {
  if (props.requestedMate.requestState !== NONE) {
    switch (props.requestedMate.requestState) {
      case DECLINED: return <RequestedMateDeclined { ...props } />
      case NOT_AVAILABLE: return <RequestedMateUnavailable { ...props } />
      default: return <RequestedMatePending { ...props } />
    }
  }

  const { mateRequests, connectedGames } = props
  const mateRequest = Array.from(mateRequests).find((gameId) => connected(gameId, connectedGames))

  if (mateRequest) {
    return <MateRequestPending { ...props } mateRequest={ mateRequest } />
  }

  return <Lobby { ...props } />
}

function connected(gameId, connectedGames) {
  return connectedGames.find((game) => game.gameId === gameId && game.inLobby)
}

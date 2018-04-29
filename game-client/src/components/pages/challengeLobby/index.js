import React from "react"

import {
  acceptMate,
  declineMate,
  requestMate,
  cancelRequestMate,
  leaveChallengeLobby
} from "../../../actionCreators"

import {
  NONE,
  PENDING,
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
      case DECLINED: return <RequestedMateDeclined {...props} />
      case NOT_AVAILABLE: return <RequestedMateUnavailable {...props} />
      default: return <RequestedMatePending {...props} />
    }
  }

  if (props.mateRequests.size > 0) {
    return <MateRequestPending {...props} />
  }

  return <Lobby {...props} />
}

function renderRequestedMate({ requestedMate, gameServer, dispatch }) {
  const text = requestedMateText(requestedMate.requestState)

  return (
    <div>
      { text }
      <button onClick={ () => dispatch(cancelRequestMate(gameServer)) }>
        Zurück
      </button>
    </div>
  )
}

function requestedMateText(state) {
  switch (state) {
    case requestedMateStates.DECLINED: return "Der Spieler hat abgelehnt"
    case requestedMateStates.NOT_AVAILABLE: return "Der Spieler hat die Lobby verlassen"
    default: return "Warte auf Spieler"
  }
}

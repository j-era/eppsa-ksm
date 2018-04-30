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

  if (props.mateRequests.size > 0) {
    return <MateRequestPending { ...props } />
  }

  return <Lobby { ...props } />
}

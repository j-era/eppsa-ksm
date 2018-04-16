import React from "react"

import { updateGameState } from "../../actionCreators"
import { CHALLENGE_MANUAL, CHALLENGE_LOBBY } from "../../gameStates"

export default function ChallengeModeSelection(props) {
  return (
    <div>
      <button onClick={ () => props.dispatch(updateGameState(CHALLENGE_MANUAL)) }>
        Alleine spielen
      </button>
      <button onClick={ () => props.dispatch(updateGameState(CHALLENGE_LOBBY)) }>
        Zu zweit spielen
      </button>
    </div>
  )
}

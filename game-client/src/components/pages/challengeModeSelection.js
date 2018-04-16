import React from "react"

import { joinChallengeLobby, updateGameState } from "../../actionCreators"
import { CHALLENGE_MANUAL } from "../../gameStates"

export default function ChallengeModeSelection(props) {
  return (
    <div>
      <button onClick={ () => props.dispatch(updateGameState(CHALLENGE_MANUAL)) }>
        Alleine spielen
      </button>
      <button onClick={ () => props.dispatch(joinChallengeLobby(props.gameServer)) }>
        Zu zweit spielen
      </button>
    </div>
  )
}

import React from "react"

import { joinChallengeLobby, startChallenge } from "../../actionCreators"
import { CHALLENGE_MANUAL } from "../../gameStates"

export default function ChallengeModeSelection(props) {
  return (
    <div>
      <button onClick={ () => props.dispatch(startChallenge(props.gameServer)) }>
        Alleine spielen
      </button>
      <button onClick={ () => props.dispatch(joinChallengeLobby(props.gameServer)) }>
        Zu zweit spielen
      </button>
    </div>
  )
}

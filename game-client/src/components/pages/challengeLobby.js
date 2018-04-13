import React from "react"

import { updateGameState } from "../../actionCreators"
import { CHALLENGE_MODE_SELECTION } from "../../gameStates"

export default function ChallengeLobby(props) {
  return (
    <div>
      <div>ChallengeLobby</div>
      <button onClick={ () => props.dispatch(updateGameState(CHALLENGE_MODE_SELECTION)) }>
        QR-Code Scannen
      </button>
    </div>
  )
}

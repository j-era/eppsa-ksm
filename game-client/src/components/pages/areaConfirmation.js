import React from "react"

import { updateGameState } from "../../actionCreators"
import { CHALLENGE_SELECTION } from "../../gameStates"

export default function AreaConfirmation(props) {
  const text = props.content.challenges[props.challengeNumber].description

  return (
    <div>
      <div>{ text }</div>
      <button onClick={ () => props.dispatch(updateGameState(CHALLENGE_SELECTION)) }>Weiter</button>
    </div>
  )
}

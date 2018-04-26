import React from "react"

import { updateGameState } from "../../actionCreators"
import { QR_READER } from "../../gameStates"

export default function NavigationToNextArea(props) {
  const text = props.content.challenges[props.challengeNumber].navigation

  return (
    <div>
      <div>{ text }</div>
      <button onClick={ () => props.dispatch(updateGameState(QR_READER)) }>QR-Code Scannen</button>
    </div>
  )
}

import React from "react"

import { showGameManual } from "../actionCreators"

export default function gameManual(props) {
  const text = props.content.manualText

  return (
    <div>
      <div>{ text }</div>
      <button onClick={ () => props.dispatch(showGameManual(false)) }>
        Ok
      </button>
    </div>
  )
}

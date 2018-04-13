import React from "react"

import { showGameManual } from "../actionCreators"

export default function GameManualButton(props) {
  return <button onClick={ () => props.dispatch(showGameManual(true)) }>i</button>
}

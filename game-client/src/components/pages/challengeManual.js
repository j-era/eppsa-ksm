import React from "react"

import { selectChallengeMode } from "../../actionCreators"

export default function ChallengeManual(props) {
  const { challengeData, content, dispatch, gameServer } = props
  const text = challengeData.challenge.manualText

  return (
    <div>
      <div>{ text }</div>
      <button onClick={ () => dispatch(selectChallengeMode(content, gameServer)) }>
        Weiter
      </button>
    </div>
  )
}

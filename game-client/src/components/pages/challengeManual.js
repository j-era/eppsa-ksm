import React from "react"

import { startChallenge } from "../../actionCreators"

export default function ChallengeManual(props) {
  const challenge = props.content.challenges[props.challengeNumber]
  const text = challenge.challengeTypes[props.challengeType].manualText

  return (
    <div>
      <div>{ text }</div>
      <button onClick={ () => props.dispatch(startChallenge(props.gameServer)) }>
        Weiter
      </button>
    </div>
  )
}

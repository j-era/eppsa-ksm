import React from "react"
import { connect } from "react-redux"

import Game from "./game"
import StartDialog from "./startDialog"

function Application(props) {
    const currentChallenge = props.content.challenges[`challenge-${props.challenge}`] // fix this it just works by accident!
    const challengeUri = resolveChallengeWebAppUri(currentChallenge)

    return (
      <div>
        <div>{ props.content.description }</div>
        { props.gameStarted ?
          <Game
            challenge={ props.challenge }
            challengeUri={ challengeUri }
            onStartChallenge={ props.onStartChallenge }
            challengeStarted={ props.challengeStarted }
            score={ props.score }
          /> :
          <StartDialog
            previousGameInfo={ props.previousGameInfo }
            name={ props.name }
            avatars={ props.content.avatars }
            avatar={ props.avatar }
            assetServerUri={ props.assetServerUri }
            onResumeGame={ props.onResumeGame }
            onStartNewGame={ props.onStartNewGame }
            onUpdateName={ props.onUpdateName }
        /> }
      </div>
    )
}

function resolveChallengeWebAppUri(challenge) {
  const webApp = Object.keys(challenge)[0]
  const protocol = document.location.protocol
  const environment = document.location.hostname.split(".").slice(1).join(".")
  return `${protocol}//${webApp}.${environment}`
}

export default connect(
  (state) => state
)(Application)

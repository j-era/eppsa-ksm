import omit from "lodash.omit"
import React from "react"
import { connect } from "react-redux"

import * as gameStates from "../gameStates"
import Game from "./game"
import WelcomeDialog from "./welcomeDialog"
import FinalScore from "./finalScore"

function Application(props) {
  switch (props.gameState) {
    case gameStates.WELCOME: return renderWelcomeDialog(props)
    case gameStates.RUNNING: return renderGame(props)
    case gameStates.FINISHED: return renderFinalScore(props)
    default: console.log("Invalid game state")
  }
}

function renderWelcomeDialog(props) {
  return <WelcomeDialog
      previousGame={ props.previousGame }
      name={ props.name }
      avatars={ props.content.avatars }
      avatar={ props.avatar }
      assetServerUri={ props.assetServerUri }
      onResumeGame={ props.onResumeGame }
      onStartNewGame={ props.onStartNewGame }
      onUpdateName={ props.onUpdateName }
    />
}

function renderGame(props) {
  const challengeTypes = props.content.challenges[props.challengeNumber].challengeTypes
  const challengeType = Object.keys(omit(challengeTypes, "template"))[0]
  const challenge = challengeTypes[challengeType]
  const challengeUri = resolveChallengeWebAppUri(challengeType)

  return <Game
      challengeNumber={ props.challengeNumber }
      challengeUri={ challengeUri }
      challenge={ challenge }
      score={ props.score }
      challengeStarted={ props.challengeStarted }
      onStartChallenge={ props.onStartChallenge }
      onChallengeReady={ props.onChallengeReady }
    />
}

function renderFinalScore(props) {
  return <FinalScore
      score={ props.score }
      text={ props.content.finalScoreText }
    />
}

function resolveChallengeWebAppUri(webApp) {
  const protocol = document.location.protocol
  const environment = document.location.hostname.split(".").slice(1).join(".")
  return `${protocol}//${webApp}.${environment}`
}

export default connect(
  (state) => state
)(Application)

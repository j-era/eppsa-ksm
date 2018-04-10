import omit from "lodash.omit"
import React from "react"
import { connect } from "react-redux"

import * as gameStates from "../gameStates"
import Game from "./game"
import WelcomeDialog from "./welcomeDialog"
import FinalScore from "./finalScore"

function Application(props) {
  if (props.showLobbyNavigation) {
    return renderLobbyNavigation(props)
  }

  switch (props.gameState) {
    case gameStates.WELCOME: return renderWelcomeDialog(props)
    case gameStates.RUNNING: return renderGame(props)
    case gameStates.FINISHED: return renderFinalScore(props)
    default: console.log("Invalid game state")
  }
}

function renderLobbyNavigation(props) {
  const { lobbyNavigation } = props.content
  return (
    <div>
      { lobbyNavigation }
    </div>
  )
}

function renderWelcomeDialog(props) {
  return <WelcomeDialog
    content={ props.content }
    resumableGame={ props.resumableGame }
    urlHasToken={ props.urlHasToken }
    name={ props.name }
    avatars={ props.content.avatars }
    avatar={ props.avatar }
    assetServerUri={ props.assetServerUri }
    onResumeGame={ props.onResumeGame }
    onStartNewGame={ props.onStartNewGame }
    onUpdateName={ props.onUpdateName } />
}

function renderGame(props) {
  const challengeTypes = props.content.challenges[props.challengeNumber].challengeTypes
  const challengeType = Object.keys(omit(challengeTypes, "template"))[0]
  const challenge = { challenge: challengeTypes[challengeType], shared: props.content.shared }
  const challengeUri = resolveChallengeWebAppUri(challengeType, props)

  return <Game
    connectedGames={ props.connectedGames }
    challengeNumber={ props.challengeNumber }
    challengeUri={ challengeUri }
    challenge={ challenge }
    score={ props.score }
    maxChallenges={ props.maxChallenges }
    connected={ props.connected }
    challengeStarted={ props.challengeStarted }
    showQrReader={ props.showQrReader }
    onToggleQrReader={ props.onToggleQrReader }
    onHandleQrReaderData={ props.onHandleQrReaderData }
    onHandleQrReaderError={ props.onHandleQrReaderError }
    cameraPermissonDenied={ props.cameraPermissonDenied }
    onStartChallenge={ props.onStartChallenge }
    onChallengeReady={ props.onChallengeReady } />
}

function renderFinalScore(props) {
  return <FinalScore
    score={ props.score }
    text={ props.content.finalScoreText } />
}

function resolveChallengeWebAppUri(webApp, props) {
  const protocol = document.location.protocol
  const environment = document.location.hostname.split(".").slice(1).join(".")
  const challengeUri = new URL(`${protocol}//${webApp}.${environment}`)

  challengeUri.searchParams.append("contentServerUri", props.contentServerUri)
  challengeUri.searchParams.append("assetServerUri", props.assetServerUri)
  challengeUri.searchParams.append("gameServerUri", props.gameServerUri)
  challengeUri.searchParams.append("challengeNumber", props.challengeNumber)

  return challengeUri.toString()
}

export default connect(
  (state) => state
)(Application)

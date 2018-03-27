import React from "react"
import QrReader from "react-qr-reader"

import GameBoard from "./gameBoard"

export default function Game(props) {
  return props.challengeStarted ?
    renderChallenge(props) :
    renderNavigation(props)
}

function renderNavigation(props) {
  const {
    activeGames,
    challengeNumber,
    maxChallenges,
    navigation,
    score,
    onScan,
    toggleQrReader,
    showQrReader } = props

  return (
    <div>
      <GameBoard
        activeGames={ activeGames }
        challengeNumber={ challengeNumber }
        maxChallenges={ maxChallenges } />
      <div>Current Challenge: { challengeNumber }</div>
      <div>Score: { score }</div>
      <div>Navigation: { navigation }</div>
      {
        showQrReader ?
        <QrReader
          onScan={ data => onScan(data, challengeNumber) }
          onError={ handleError }
          showViewFinder={ false }
        /> : null
      }
      <button onClick={ toggleQrReader }>scan QrCode</button>
    </div>
  )
}

function renderChallenge({ challenge, challengeUri, onChallengeReady }) {
  return (
    <iframe
      allow="camera"
      src={ challengeUri }
      ref={ iframe => {
        if (iframe) {
          iframe.onload = () =>
            onChallengeReady(iframe.contentWindow, challenge, challengeUri)
        }
      } } />
  )
}

function handleError(err){
  console.error(err)
}

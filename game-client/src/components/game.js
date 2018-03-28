import React from "react"
import QrReader from "react-qr-reader"

import GameBoard from "./gameBoard"

export default function Game(props) {
  return props.challengeStarted ?
    renderChallenge(props) :
    renderNavigation(props)
}

function renderNavigation(props) {
    connectedGames,
    connected,
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
        connectedGames={ connectedGames }
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
      <button onClick={ toggleQrReader }>{showQrReader ? "hide Scanner" : "show Scanner"}</button>
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
          // eslint-disable-next-line no-param-reassign
          iframe.onload = () =>
            onChallengeReady(iframe.contentWindow, challenge, challengeUri)
        }
      } } />
  )
}

function handleError(err){
  console.error(err)
}

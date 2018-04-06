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
    connectedGames,
    connected,
    challengeNumber,
    maxChallenges,
    navigation,
    score,
    onToggleQrReader,
    onStartChallenge,
    showQrReader
  } = props

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
        renderQrReader(props)
      }
      {
        connected ?
          <div>
            <button onClick={ onToggleQrReader }>{
              showQrReader ? "hide Scanner" : "show Scanner" }
            </button>
            <button
              className={ "startChallenge" }
              onClick={ onStartChallenge }>
              start Challenge
            </button>
          </div> :
          "not connected"
      }

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

function renderQrReader(props) {
  const {
    showQrReader,
    onHandleQrReaderData,
    onHandleQrReaderError,
    challengeNumber,
    cameraPermissonDenied
  } = props

  if (showQrReader) {
    if (!cameraPermissonDenied) {
      return (
        <QrReader
          onScan={ data => onHandleQrReaderData(data, challengeNumber) }
          onError={ onHandleQrReaderError }
          showViewFinder={ false } />
      )
    } else {
      return <div>please give camera permissions</div>
    }
  }
}

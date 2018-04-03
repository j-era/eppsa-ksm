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
      toggleQrReader,
      startChallenge,
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
      <button onClick={ toggleQrReader }>{showQrReader ? "hide Scanner" : "show Scanner"}</button>
      <button onClick={ startChallenge }>start Challenge</button>
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

function renderQrReader(props){
  const {
    onScan,
    showQrReader,
    handleQrReaderError,
    challengeNumber,
    cameraPermissonDenied
  } = props

  if (showQrReader && !cameraPermissonDenied){
    return(
      <QrReader
        onScan={data => onScan(data, challengeNumber)}
        onError={handleQrReaderError}
        showViewFinder={false}/>
    )
  } else if (cameraPermissonDenied){
    return (<div>please give camera permissions</div>)
  }

}

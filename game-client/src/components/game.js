import React from "react"

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
    onStartChallenge
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
        connected ?
          <button onClick={ () => onStartChallenge() }>Start</button> :
          <button onClick={ () => onStartChallenge() } disabled>Reconnecting...</button>
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

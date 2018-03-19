import React from "react"

export default function Game(props) {
    return props.challengeStarted ?
      renderChallenge(props) :
      renderNavigation(props)
}

function renderNavigation({ challenge, navigation, score, onStartChallenge }) {
  return (
    <div> 
      <div>Current Challenge: { challenge }</div>
      <div>Score: { score }</div>
      <div>Navigation: { navigation }</div>
      <button onClick={ () => onStartChallenge() }>Start</button>
    </div>
  )
}

function renderChallenge({ challengeConfig, challengeUri, onChallengeReady }) {
  return (
    <iframe
      allow="camera"
      src={ challengeUri }
      ref={ (iframe) => iframe ? onChallengeReady(iframe.contentWindow, challengeConfig, challengeUri) : null }
    />
  )
}


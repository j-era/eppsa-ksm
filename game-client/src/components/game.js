import React from "react"

export default function Game(props) {
    return props.challengeStarted ?
      renderChallenge(props) :
      renderNavigation(props)
}

function renderNavigation({ challengeNumber, navigation, score, onStartChallenge }) {
  return (
    <div> 
      <div>Current Challenge: { challengeNumber }</div>
      <div>Score: { score }</div>
      <div>Navigation: { navigation }</div>
      <button onClick={ () => onStartChallenge() }>Start</button>
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
      }}
    />
  )
}


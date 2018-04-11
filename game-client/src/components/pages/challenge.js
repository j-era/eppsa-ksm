import React from "react"

export default function Challenge(props) {
  const challenge =
    props.content.challenges[props.challengeNumber].challengeTypes[props.challengeType]
  const shared = props.content.shared
  const challengeData = { challenge, shared }

  return (
    <iframe
      style={ { width: "200px", height: "300px" } }
      allow="camera"
      src={ props.challengeUri }
      ref={ iframe => {
        if (iframe) {
          // eslint-disable-next-line no-param-reassign
          iframe.onload =
            () => props.onChallengeReady(iframe.contentWindow, challengeData, props.challengeUri)
        }
      } } />
  )
}

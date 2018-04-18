import React from "react"

export default function Challenge(props) {
  return (
    <iframe
      allow="camera"
      src={ props.challengeUri }
      ref={ iframe => {
        if (iframe) {
          // eslint-disable-next-line no-param-reassign
          iframe.onload =
            () => props.onChallengeReady(iframe.contentWindow, props.challengeData, props.challengeUri)
        }
      } } />
  )
}

import React from "react"

export default function Challenge(props) {
  return (
    <iframe
      style={ { width: "300px", height: "600px" } }
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

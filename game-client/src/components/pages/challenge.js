import React from "react"

export default function Challenge(props) {
  const challenge = props.content.challenges[props.challengeNumber].challengeTypes[props.challengeType]
  const shared = props.content.shared

  return (
    <iframe
      style={ { width: "200px", height: "300px" } }
      allow="camera"
      src={ props.challengeUri }
      ref={ iframe => {
        if (iframe) {
          // eslint-disable-next-line no-param-reassign
          iframe.onload =
            () => iframe.contentWindow.postMessage({ challenge, shared }, props.challengeUri)
        }
      } } />
  )
}

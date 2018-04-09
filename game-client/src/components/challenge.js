import React from "react"

export default class Challenge extends React.Component {
  render() {
    const { challenge, challengeUri, onChallengeReady } = this.props

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
}
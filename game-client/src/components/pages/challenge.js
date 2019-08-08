import React from "react"
import styled from "styled-components"


const Iframe = styled.iframe`
  overflow: hidden;

  width: 100%;
  height: 100%;

  border: none;
`

export default function Challenge({ challengeUri, challengeData, onChallengeReady }) {
  return (
    <Iframe
      src={ challengeUri }
      innerRef={ iframe => {
        if (iframe) {
          // eslint-disable-next-line no-param-reassign
          iframe.onload = () =>
            onChallengeReady(iframe.contentWindow, challengeData, challengeUri)
        }
      } } />
  )
}

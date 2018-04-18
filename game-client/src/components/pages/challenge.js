import React from "react"
import styled from "styled-components"


const Iframe = styled.iframe`
  overflow: hidden;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  border: none;
`

export default function Challenge(props) {
  return (
    <Iframe
      src={ props.challengeUri }
      innerRef={ iframe => {
        if (iframe) {
          // eslint-disable-next-line no-param-reassign
          iframe.setAttribute("allow", "camera")
          iframe.onload =
            () => props.onChallengeReady(iframe.contentWindow, props.challengeData, props.challengeUri)
        }
      } } />
  )
}

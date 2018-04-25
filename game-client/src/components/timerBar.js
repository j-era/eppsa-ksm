import React from "react"
import styled, { css, keyframes } from "styled-components"


const Container = styled.div`
  width: 50%;
  height: 10px;

  border-radius: ${props => props.theme.layout.borderRadius};

  background: ${props => props.theme.colors.secondary};
`

const Progress = styled.div`
  width: 100%;
  height: 100%;

  background: ${props => props.theme.colors.background};

  transform-origin: left;
  transform: scale(1, 1);

  animation: ${decrease()} ${props => props.seconds}s linear forwards;
  animation-play-state: ${props => props.playState};
`

function decrease() {
  return keyframes`
    0% {
      transform: scale(1, 1);
    }
    100% {
      transform: scale(0, 1);
    }
  `
}

export default ({ seconds, running }) =>
  <div>
    <Container>
      <Progress seconds={ seconds } playState={ running ? "running" : "paused" } />
    </Container>
  </div>

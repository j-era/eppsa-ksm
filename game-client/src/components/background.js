import React from "react"
import styled from "styled-components"

import { default as TimerBarComponent } from "./timerBar"

const Container = styled.div`
  position: absolute;

  box-sizing: border-box;

  width: 100%;
  display: flex;
  flex-direction: column;

  height: 100%;

  background-color: ${props => props.theme.colors.area};
  transition: transform 0.5s ease;
  transform-origin: bottom;

  transform: scaleY(${({ showHeader }) => showHeader ? 0.9 : 1.0});
`

const Cross = styled.div`
  position: absolute;
  width: 100%; 
  height: 100%;
  background-color: #ffffff;
  clip-path: polygon(0 0, 100% 0, 50% 50%, 100% 100%, 0 100%, 50% 50%);
`

const BackgroundContainer = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`

const TimerBarContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: transform 0.5s ease;
  transform: scaleY(${({ showHeader }) => showHeader ? 1.1 : 1.0});
`

const TimerBar = styled(TimerBarComponent)`
  position: absolute;

  top: 3vw;

  z-index: 9999;

  width: 50%;
`

export default function Background(props) {
  return (
    <Container
      className={ props.className }
      showHeader={ props.showHeader }>
      <Cross />
      { renderTimerBar(props) }
      <BackgroundContainer>
        { props.children }
      </BackgroundContainer>
    </Container>
  )
}

function renderTimerBar({ showHeader, gameState, challengeData, timelineClockRunning }) {
  if (gameState === "CHALLENGE" && challengeData.challenge.score.sessionLength > 0) {
    return (
      <TimerBarContainer
        showHeader={ showHeader }>
        <TimerBar
          initSeconds={ challengeData.challenge.score.sessionLength }
          isRunning={ timelineClockRunning } />
      </TimerBarContainer>
    )
  }
}

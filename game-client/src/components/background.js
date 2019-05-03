import React from "react"
import styled from "styled-components"

import { default as TimerBarComponent } from "./timerBar"

const Container = styled.div`
  position: relative;

  box-sizing: border-box;

  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: ${({ showHeader }) => showHeader ? 0.8 : 1};

  background-color: ${props => props.theme.colors.area};
  transition: flex-grow 0.5s ease, background-color 0.5s ease;
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
`

const TimerBar = styled(TimerBarComponent)`
  position: absolute;

  top: 5vw;

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

function renderTimerBar({ gameState, challengeData, timelineClockRunning }) {
  if (gameState === "CHALLENGE" && challengeData.challenge.score.sessionLength > 0) {
    return (
      <TimerBarContainer>
        <TimerBar
          initSeconds={ challengeData.challenge.score.sessionLength }
          isRunning={ timelineClockRunning } />
      </TimerBarContainer>
    )
  }
}

import React from "react"
import styled from "styled-components"

import Banner from "./banner"
import { default as TimerBarComponent } from "./timerBar"

const Container = styled.div`
  position: relative;

  box-sizing: border-box;

  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  transition: transform 500ms ease;
  animation: ${props => props.showScore ? "slideDown 3s" : ""};

  background-color: ${props => props.theme.colors.area};
  transition: background-color 0.5s ease;

  @keyframes slideDown {
      0% {transform: translateY(0vw);}
      20% {transform: translateY(10vw);}
      80% {transform: translateY(10vw);}
      100% {transform: translateY(0vw);}
  }
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

const BannerContainer = styled.div`
  visibility: ${props => props.visible ? "visible" : "hidden"};
  display: flex;
  position: absolute;
  transform: translateY(-3vw);
  width: 100%;
  justify-content: center;
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
      isBannerVisible={ isBannerVisible(props.gameState) }
      showScore={ props.showScore }>
      <Cross />
      <BannerContainer visible={ isBannerVisible(props.gameState) }>
        <Banner>{ props.bannerText }</Banner>
      </BannerContainer>
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

function isBannerVisible(gamestate) {
  switch (gamestate) {
    case "NEW_GAME_AVATAR_SELECTION":
    case "NEW_GAME_AVATAR_CONFIRMATION":
    case "NEW_GAME_NAME_SELECTION":
      return true
    default:
      return false
  }
}

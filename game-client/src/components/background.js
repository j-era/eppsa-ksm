import React from "react"
import styled from "styled-components"
import BackgroundArcSvg from "../assets/Background_Arc.svg"

import Banner from "./banner"
import { default as TimerBarComponent } from "./timerBar"

const Container = styled.div`
  position: relative;

  padding-top: ${props => props.isBannerVisible ? "5vw" : "0vw"};

  box-sizing: border-box;

  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const BackgroundArcSVG = styled(BackgroundArcSvg)`
  fill: ${props => props.theme.colors.area};
  margin-bottom: -1px;
  width: 100%;
  height: 37px;
  background-color: white;
`

const Background = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  background-color: ${props => props.theme.colors.area};
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

  height: 37px;
`

const TimerBar = styled(TimerBarComponent)`
  position: absolute;

  top: 20px;

  z-index: 9999;

  width: 50%;
`

export default props =>
  <Container className={ props.className } isBannerVisible={ isBannerVisible(props.gameState) }>
    <BannerContainer visible={ isBannerVisible(props.gameState) }>
      <Banner>{ props.bannerText }</Banner>
    </BannerContainer>
    <BackgroundArcSVG />
    { props.gameState === "CHALLENGE" && renderTimerBar(props) }
    <Background>
      { props.children }
    </Background>
  </Container>


function renderTimerBar(props) {
  return (
    <TimerBarContainer>
      <TimerBar seconds={ props.timelineClockTime } running={ props.timelineClockRunning } />
    </TimerBarContainer>
  )
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

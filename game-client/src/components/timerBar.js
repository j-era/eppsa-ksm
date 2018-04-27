import React from "react"
import styled, { keyframes } from "styled-components"
import FuseIcon from "../svg/EPPSA_Assets_Counterdown_Fuse_Fire_1.svg"
import FuseIcon1 from "../svg/EPPSA_Assets_Counterdown_Fuse_Fire_2.svg"
import FuseIcon2 from "../svg/EPPSA_Assets_Counterdown_Fuse_Fire_3.svg"

const Container = styled.div`
  display: flex;
  align-items: center;

  background: none;
`

const TimeBall = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;

  width: 30px;
  height: 30px;

  border-radius: 50px;

  background: ${props => props.theme.colors.background};

  color: ${props => props.theme.colors.area};

  font-size: ${props => props.theme.font.text.size};

  z-index: 1;
`

const ProgressBar = styled.div`
  margin-left: -15px;

  width: 100%;

  height: 12px;

  border-radius: ${props => props.theme.layout.borderRadius};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  background: ${props => props.theme.colors.secondary};

  display: flex;

  position: relative;
`

const Progress = styled.div`
  width: 100%;
  height: 100%;

  background: ${props => props.theme.colors.background};

  transform-origin: left;

  animation: ${decrease()} ${props => props.seconds}s linear forwards;
  animation-play-state: ${props => props.playState};
`

const Fuse = styled.div`
  margin-left: -5px;

  display: flex;

  align-items: center;

  width: 100%;
  height: 100%;

  position: absolute;
  left: 100%;

  animation: ${decreaseFuse()} ${props => props.seconds}s linear forwards;
  animation-play-state: ${props => props.playState};
`

const FuseSVG1 = styled(FuseIcon)`
  position: absolute;

  width: 30px;
  height: 30px;

  fill: ${props => props.theme.colors.background};

  opacity: 1;

  animation: ${blinkOut()} 1.5s steps(1, end) 0s infinite;
`

const FuseSVG2 = styled(FuseIcon1)`
  position: absolute;

  width: 30px;
  height: 30px;

  fill: ${props => props.theme.colors.background};

  opacity: 0;

  animation: ${blinkIn()} 1.5s steps(1, start) 0.5s infinite;
`

const FuseSVG3 = styled(FuseIcon2)`
  position: absolute;

  width: 30px;
  height: 30px;

  fill: ${props => props.theme.colors.background};

  opacity: 0;

  animation: ${blinkIn()} 1.5s steps(1, start) 1s infinite;
`

function blinkOut() {
  return keyframes`
    33.33% {
      opacity: 0.0;
    }
  `
}

function blinkIn() {
  return keyframes`
    33.33% {
      opacity: 1.0;
    }
  `
}

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

function decreaseFuse() {
  return keyframes`
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  `
}

export default (props) =>
  <Container { ...props }>
    <TimeBall>{ props.seconds }</TimeBall>
    <ProgressBar>
      <Progress seconds={ props.seconds } playState={ props.running ? "running" : "paused" } />
      <Fuse seconds={ props.seconds } playState={ props.running ? "running" : "paused" } >
        <FuseSVG1 seconds={ props.seconds } />
        <FuseSVG2 seconds={ props.seconds } />
        <FuseSVG3 seconds={ props.seconds } />
      </Fuse>
    </ProgressBar>
  </Container>

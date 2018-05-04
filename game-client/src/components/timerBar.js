import React from "react"
import styled, { css, keyframes } from "styled-components"
import FuseIcon from "../svg/EPPSA_Assets_Counterdown_Fuse_Fire_1.svg"
import FuseIcon1 from "../svg/EPPSA_Assets_Counterdown_Fuse_Fire_2.svg"
import FuseIcon2 from "../svg/EPPSA_Assets_Counterdown_Fuse_Fire_3.svg"

const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background: none;
`

const TimeBallContainer = styled.div`
  position: relative;

  width: 20%;
`

const TimeBall = styled.div`
  position: relative;

  border-radius: 50%;

  width: 100%;
  height: 0;
  padding-bottom: 100%;

  background: ${props => props.theme.colors.background};

  color: ${props => props.theme.colors.area};

  font-size: ${props => props.theme.font.text.size}vw;

  z-index: 1;
`

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

const ProgressBar = styled.div`
  position: absolute;

  width: 85%;
  margin-left: 15%;

  height: 12px;

  border-radius: ${props => props.theme.layout.borderRadius};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  background: ${props => props.theme.colors.secondary};

  display: flex;
`

const Progress = styled.div`
  width: ${props => props.isRunning ? 100 : props.countdown / props.seconds * 100}%;
  height: 100%;

  background: ${props => props.theme.colors.background};

  transform-origin: left;

  ${props => props.isRunning ? css`
    animation: ${decrease()} ${props => props.seconds}s linear forwards};
  ` : `
  `}
`

const Fuse = styled.div`
  display: flex;

  align-items: center;

  width: 100%;
  height: 100%;

  position: absolute;
  left: 98%;

  transform: translateX(-${props => props.isRunning ? 0 : (1 - props.countdown / props.seconds) * 100}%);

  ${props => props.isRunning ? css`
    animation: ${decreaseFuse()} ${props => props.seconds}s linear forwards};
  ` : `
  `}
`

const FuseSVG1 = styled(FuseIcon)`
  position: absolute;

  width: 30px;
  height: 30px;

  fill: ${props => props.theme.colors.background};

  opacity: 1;

  animation: ${blinkOut()} 2.0s steps(1, end) 0s infinite;
`

const FuseSVG2 = styled(FuseIcon1)`
  position: absolute;

  width: 30px;
  height: 30px;

  fill: ${props => props.theme.colors.background};

  opacity: 0;

  animation: ${blinkIn()} 2.0s steps(1, end) 0s infinite;
`

function blinkOut() {
  return keyframes`
    50% {
      opacity: 0.0;
    }
  `
}

function blinkIn() {
  return keyframes`
    50% {
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

export default class TimerBar extends React.Component {
  constructor(props) {
    super(props)

    this.countdown = 0

    this.state = {
      countdown: props.initSeconds
    }
  }

  componentDidUpdate() {
    if (this.props.isRunning) {
      if (!this.interval) {
        this.interval = setInterval(() => {
          if (this.state.countdown === 0) {
            clearInterval(this.interval)
          } else {
            this.setState({ countdown: this.state.countdown - 1 })
          }
        }, 1000)
      }
    } else {
      clearInterval(this.interval)
    }
  }

  render() {
    return (
      <Container { ...this.props }>
        <TimeBallContainer>
          <TimeBall><Text>{ this.state.countdown }</Text></TimeBall>
        </TimeBallContainer>
        <ProgressBar>
          <Progress
            seconds={ this.props.initSeconds }
            countdown={ this.state.countdown }
            isRunning={ this.props.isRunning } />
          { this.renderFuse() }
        </ProgressBar>
      </Container>
    )
  }

  renderFuse() {
    return (
      <Fuse
        seconds={ this.props.initSeconds }
        countdown={ this.state.countdown }
        isRunning={ this.props.isRunning } >
        <FuseSVG1 />
        <FuseSVG2 />
      </Fuse>
    )
  }
}

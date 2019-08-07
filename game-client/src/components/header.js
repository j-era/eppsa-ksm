import React from "react"
import styled from "styled-components"
import GameManualButton from "./gameManualButton"
import Score from "./score"

const Header = styled.div`
  position: absolute;

  box-sizing: border-box;

  width: 100%;
  display: flex;
  flex-direction: column;

  height: 10%;

  background-color: ${props => props.theme.colors.area};

  overflow: hidden;
`

const Logo = styled.img`
  position: absolute;
  width: 30%;
  opacity: ${({ show }) => show ? 1 : 0};
  transition: opacity 1s ease;
`

export default function renderHeader(props) {
  return (
    <Header show={ props.show }>
      <Logo
        show={ !props.showScore }
        src={ `${props.assetServerUri}/${props.content.logo.src}` } />
      <GameManualButton { ...props } show={ props.show && !props.showGameManual } />
      <Score show={ props.showScore } score={ props.score } oldScore={ props.oldScore } />
    </Header>
  )
}

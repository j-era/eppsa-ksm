import React from "react"
import styled from "styled-components"
import GameManualButton from "./gameManualButton"
import Score from "./score"

const Header = styled.div`
  position: relative;
  flex-grow: ${props => props.show ? 0.2 : 0};
  overflow: hidden;
  transition: flex-grow 0.5s ease;
  background-color: ${props => props.theme.colors.area};
`

const Logo = styled.img`
  position: absolute;
  width: 30%;
`

export default function renderHeader(props) {
  return (
    <Header show={ props.show }>
      <Logo
        src={ `${props.assetServerUri}/${props.content.shared.assets.dashboardWingSign.src}` } />
      <GameManualButton { ...props } show={ props.show && !props.showGameManual } />
      {
        props.showScore && <Score score={ props.score } oldScore={ props.oldScore } />
      }
    </Header>
  )
}

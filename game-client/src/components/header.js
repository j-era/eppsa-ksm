import React from "react"
import styled from "styled-components"
import GameManualButton from "./gameManualButton"
import Score from "./score"

import { setShowGameManual } from "../actionCreators"

const Container = styled.div`
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
  transition: opacity 0.5s ease;
`

export default function Header({
  show, showScore, showGameManual, assetServerUri, content, score, oldScore, dispatch
}) {
  return (
    <Container show={ show }>
      <Score show={ showScore } score={ score } oldScore={ oldScore } />
      <Logo
        show={ show && !showScore }
        src={ `${assetServerUri}/${content.logo.src}` } />
      <GameManualButton
        show={ show && !showGameManual && !showScore }
        onClick={ () => !showGameManual && dispatch(setShowGameManual(true)) } />
    </Container>
  )
}

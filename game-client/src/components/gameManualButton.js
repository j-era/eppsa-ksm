import React from "react"
import styled from "styled-components"

import { showGameManual } from "../actionCreators"

import InfoButton from "../../node_modules/eppsa-ksm-shared/assets/EPPSA_Assets_Info-Button.svg"

const Container = styled.div`
position: absolute;
  z-index: 999;
  width: 8.15vw;
  right: 2.5vw;
  top: 2.5vw;

  transition: opacity 0.5s ease;
  opacity: ${({ show }) => show ? 1 : 0};
`

export default function GameManualButton({ dispatch, show, showHeader }) {
  return (
    <Container
      show={ show }
      showHeader={ showHeader }
      onClick={ () => dispatch(showGameManual(true)) }>
      <InfoButton />
    </Container>
  )
}

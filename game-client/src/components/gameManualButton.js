import React from "react"
import styled, { css } from "styled-components"

import { showGameManual } from "../actionCreators"

import InfoButton from "../../node_modules/eppsa-ksm-shared/assets/EPPSA_Assets_Info-Button.svg"

const Container = styled.div`
position: absolute;
  width: 8.15vw;
  left: 2.5vw;
  top: 2.5vw;

  ${props => props.show ?
    css`opacity: 1; transition: opacity 1s ease;` :
    css`opacity: 0; transition: opacity 1s ease;`}
`

export default function GameManualButton({ dispatch, show }) {
  return (
    <Container show={ show } onClick={ () => dispatch(showGameManual(true)) }>
      <InfoButton />
    </Container>
  )
}

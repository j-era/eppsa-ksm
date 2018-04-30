import React from "react"
import styled from "styled-components"

import { showGameManual } from "../actionCreators"

import InfoButton from "../../node_modules/eppsa-ksm-shared/assets/EPPSA_Assets_Info-Button.svg"

const Button = styled(InfoButton)`
  position: absolute;
  width: 8.15vw;
  left: 2.5vw;
  top: 2.5vw;
`

export default function GameManualButton(props) {
  return <Button onClick={ () => props.dispatch(showGameManual(true)) } />
}

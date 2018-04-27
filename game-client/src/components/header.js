import React from "react"
import styled from "styled-components"
import GameBoard from "./gameBoard"
import GameManualButton from "./gameManualButton"

const Header = styled.div`
  height: 15%;
  overflow: hidden;
`
export default function renderHeader({ props }) {
  return (
    <Header>
      <GameBoard { ...props } />
      { !props.showGameManual && <GameManualButton { ...props } /> }
    </Header>
  )
}

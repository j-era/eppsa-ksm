import React from "react"
import styled from "styled-components"
import GameManualButton from "./gameManualButton"

const Header = styled.div`
  height: ${props => props.show ? 6 : 0}%;
  overflow: hidden;
  transition: height 0.5s ease;
`
export default function renderHeader(props) {
  return (
    <Header show={ props.show }>
      <GameManualButton { ...props } show={ props.show && !props.showGameManual } />
    </Header>
  )
}

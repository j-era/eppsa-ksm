import React from "react"
import styled from "styled-components"
import GameBoard from "./gameBoard"
import GameManualButton from "./gameManualButton"

const Header = styled.div`
  height: ${props => 100 - props.appRatio}%;
  overflow: scroll;
`
export default function renderHeader({ props, appRatio }) {
  return (
    <Header
      onScroll={ handleScroll }
      appRatio={ appRatio }>
      <GameBoard { ...props } />
      { !props.showGameManual && <GameManualButton { ...props } /> }
    </Header>
  )
}

let scrollbackTimout

function handleScroll(event) {
  event.persist()
  const persistedEvent = event

  if (scrollbackTimout) {
    clearInterval(scrollbackTimout)
  }

  scrollbackTimout = setTimeout(() => {
    const scrollIntervall = setInterval(() => {
      persistedEvent.target.scrollLeft > 0 ?
        persistedEvent.target.scrollLeft -= 10
        :
        clearInterval(scrollIntervall)
    }, 10)
  }, 2000)
}

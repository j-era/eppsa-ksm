import styled, { injectGlobal } from "styled-components"

import React from "react"
import GameView from "./gameView"
import Lobby from "./lobby"

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  #root, html, body {
    height: 100%;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    user-select: none;
  }
  
  input {
    border: none;
  }
`

const Container = styled.div`
  height: 100%;
  width: 100%;
  
  position: absolute;
`

export default class App extends React.Component {
  constructor({ server, content }) {
    super()

    this.server = server
    this.content = content

    this.server.on("startGame", game => {
      this.setState({ game })
    })

    this.server.on("partnerFinishedQuests", partnerFinishedQuests => {
      this.setState({ partnerFinishedQuests })
    })

    this.state = {
      game: null,
      partnerFinishedQuests: false
    }
  }

  render() {
    return (
      <Container>
        { this.state.game ?
          <GameView
            content = { this.content }
            game = { this.state.game }
            partnerFinishedQuests={ this.state.partnerFinishedQuests }
            playerId = { this.server.id }
            handleQrResult = { (scannedLink) => this.handleQrResult(scannedLink) }
            server = { this.server } />
          :
          <Lobby
            server={ this.server }
            content = { this.content.selectSharedContent() } /> }
      </Container>
    )
  }
}

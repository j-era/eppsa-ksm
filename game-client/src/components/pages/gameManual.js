import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { delay, NextButton, Page, PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

import { showGameManual, updateGameState } from "../../actionCreators"
import * as gameStates from "../../gameStates"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const StyledNextButton = styled(NextButton)`
   ${props => props.isInitial && `border-color: ${props.theme.colors.primary}`};
`

export default class GameManual extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { nextClicked: false }
  }

  render() {
    return (
      <Container>
        <PageTitle>{ this.props.content.gameManualTitle }</PageTitle>
        <StyledMarkdown>{ this.props.content.gameManualText }</StyledMarkdown>
        <StyledNextButton
          isInitial={ this.props.gameState === gameStates.INITIAL_GAME_MANUAL }
          visible
          onClick={ this.onNext }
          clicked={ this.state.nextClicked }
          text={ this.props.gameState === gameStates.INITIAL_GAME_MANUAL ? "Los geht's" : "OK" } />
      </Container>
    )
  }

  async onNext() {
    this.setState({ nextClicked: true })
    await delay(100)

    if (this.props.gameState === gameStates.INITIAL_GAME_MANUAL) {
      this.props.dispatch(updateGameState(gameStates.PLAYER_TYPE_SELECTION))
    } else {
      this.props.dispatch(showGameManual(false))
    }
  }
}

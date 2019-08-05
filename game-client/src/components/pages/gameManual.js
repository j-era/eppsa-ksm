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
    const { content, gameState, playerType } = this.props
    return (
      <Container>
        <PageTitle>{ content[playerType].gameManualTitle }</PageTitle>
        <StyledMarkdown>{ content[playerType].gameManualText }</StyledMarkdown>
        <StyledNextButton
          isInitial={ gameState === gameStates.INITIAL_GAME_MANUAL }
          visible
          onClick={ this.onNext }
          clicked={ this.state.nextClicked }
          text={ gameState === gameStates.INITIAL_GAME_MANUAL ? "Los geht's" : "OK" } />
      </Container>
    )
  }

  async onNext() {
    this.setState({ nextClicked: true })
    await delay(100)

    if (this.props.gameState === gameStates.INITIAL_GAME_MANUAL) {
      this.props.dispatch(updateGameState(gameStates.AREA_CONFIRMATION))
    } else {
      this.props.dispatch(showGameManual(false))
    }
  }
}

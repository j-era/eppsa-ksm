import React from "react"
import autoBind from "react-autobind"
import styled, { css } from "styled-components"
import { delay, NextButton, PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

import { showGameManual, startNewGame } from "../../actionCreators"
import * as gameStates from "../../gameStates"

const Container = styled.div `
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ManualText = styled.div`
  display: flex;
  flex-shrink: 1;
`

const StyledNextButton = styled(NextButton)`
   ${props => props.isInitial && css`border-color: ${props.theme.colors.primary}`};
   flex-shrink: 0;
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
        <PageTitle text={ this.props.content.gameManualTitle } />
        <ManualText>
          <StyledMarkdown>{ this.props.content.gameManualText }</StyledMarkdown>
        </ManualText>
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
      const { name, avatar, maxChallenges, gameServer } = this.props
      this.props.dispatch(startNewGame(name, avatar, maxChallenges, gameServer))
    } else {
      this.props.dispatch(showGameManual(false))
    }
  }
}

import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { delay, NextButton, PageTitle, StyledMarkdown } from "eppsa-ksm-shared"

import { showGameManual } from "../../actionCreators"

const Container = styled.div `
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ManualText = styled.div`
  display: flex;
  flex-shrink: 0.2;
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
        <NextButton
          visible
          onClick={ this.onNext }
          clicked={ this.state.nextClicked }
          text="Ok" />
      </Container>
    )
  }

  async onNext() {
    this.setState({ nextClicked: true })
    await delay(100)
    this.props.dispatch(showGameManual(false))
  }
}

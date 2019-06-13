import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"

import {
  Button,
  delay,
  Description,
  NextButton,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import { resumeGame, startNewGame } from "../../actionCreators"

const Container = styled(Page)`
  display: flex;
  flex-direction: column;
`

const Content = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const StyledDescription = styled(Description)`
  margin-top: ${props => props.theme.layout.smallSpacing}vw;
  max-height: calc(3em + ${props => props.theme.layout.smallSpacing}vw);
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
`

const ConfirmButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  border-color: ${props => props.theme.colors.primary};
`

const BackButton = styled(Button)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  align-self: center;
  border-color: ${props => props.theme.colors.secondary};
`

class ResumeOrNewGameSelection extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { nextClicked: false, backClicked: false }
  }

  render() {
    const { content } = this.props
    const { challengeNumber, score } = this.props.resumableGame

    return (
      <Container>
        <PageTitle>{ content.shared.texts.resumeGameTitle }</PageTitle>
        <Content>
          <StyledDescription>
            { content.shared.texts.resumeGameText }
          </StyledDescription>
          <StyledDescription>
            { `challengeNumber ${challengeNumber}` }
          </StyledDescription>
          <StyledDescription>
            { `score ${score}` }
          </StyledDescription>
          <Buttons>
            <ConfirmButton
              visible
              onClick={ this.confirm }
              clicked={ this.state.nextClicked }
              text={ content.shared.texts.resumeGameButton } />
            <BackButton
              onClick={ this.back }
              clicked={ this.state.backClicked }>
              { content.shared.texts.newGameButton }
            </BackButton>
          </Buttons>
        </Content>
      </Container>
    )
  }

  async confirm() {
    const { dispatch, resumableGame } = this.props
    this.setState({ nextClicked: true })
    await delay(100)
    dispatch(resumeGame(resumableGame))
  }

  async back() {
    this.setState({ backClicked: true })
    await delay(100)
    this.props.dispatch(startNewGame())
  }
}

export default withTheme(ResumeOrNewGameSelection)

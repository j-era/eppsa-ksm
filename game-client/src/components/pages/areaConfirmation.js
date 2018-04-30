import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"
import { delay, Description, FramedIcon, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { updateGameState } from "../../actionCreators"
import { CHALLENGE_SELECTION } from "../../gameStates"

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
  padding-left: ${props => props.theme.layout.cardViewWidth * 0.12}vw;
  padding-right: ${props => props.theme.layout.cardViewWidth * 0.12}vw;
`

class AreaConfirmation extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { nextClicked: false }
  }

  render() {
    const { assetServerUri, challengeNumber, content, theme } = this.props
    const challenge = content.challenges[challengeNumber]

    return (
      <Container>
        <PageTitle>{ challenge.name }</PageTitle>
        <Content>
          <FramedIcon
            scale={ 0.78 }
            color={ theme.colors.area }
            iconSrc={ `${assetServerUri}/${challenge.icon.src}` } />
          <StyledDescription>
            { content.shared.texts.areaConfirmationText }
          </StyledDescription>
          <NextButton
            visible
            clicked={ this.state.nextClicked }
            onClick={ this.onNext }
            text={ content.shared.texts.next } />
        </Content>
      </Container>
    )
  }

  async onNext() {
    this.setState({ nextClicked: true })
    await delay(100)
    this.props.dispatch(updateGameState(CHALLENGE_SELECTION))
  }
}

export default withTheme(AreaConfirmation)

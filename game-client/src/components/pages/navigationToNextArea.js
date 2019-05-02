import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"
import { delay, Description, FramedIcon, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { updateGameState } from "../../actionCreators"
import { AREA_CONFIRMATION } from "../../gameStates"

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

class NavigationToNextArea extends React.Component {
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
            scale={ 0.8 }
            color={ theme.colors.area }
            iconSrc={ `${assetServerUri}/${challenge.icon.src}` } />
          <Description>
            { content.shared.texts.navigationToNextArea }
          </Description>
          <NextButton
            visible
            clicked={ this.state.nextClicked }
            onClick={ this.onNext }
            text={ content.shared.texts.navigationToNextAreaButton } />
        </Content>
      </Container>
    )
  }

  async onNext() {
    this.setState({ nextClicked: true })
    await delay(100)
    this.props.dispatch(updateGameState(AREA_CONFIRMATION))
  }
}

export default withTheme(NavigationToNextArea)

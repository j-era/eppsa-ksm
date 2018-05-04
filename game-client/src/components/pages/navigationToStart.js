import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"
import { delay, Description, FramedIcon, NextButton, Page, PageTitle } from "eppsa-ksm-shared"

import { updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_SELECTION } from "../../gameStates"

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

class NavigationToStart extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { nextClicked: false }
  }

  render() {
    const { assetServerUri, content, theme } = this.props

    return (
      <Container>
        <PageTitle>{ content.shared.texts.navigationToStartTitle }</PageTitle>
        <Content>
          <FramedIcon
            scale={ 0.8 }
            color={ theme.colors.area }
            iconSrc={ `${assetServerUri}/${content.shared.assets.quizIcon.src}` } />
          <Description>
            { content.shared.texts.navigationToStartText }
          </Description>
          <NextButton
            visible
            clicked={ this.state.nextClicked }
            onClick={ this.onNext }
            text={ content.shared.texts.navigationToStartButtonText } />
        </Content>
      </Container>
    )
  }

  async onNext() {
    this.setState({ nextClicked: true })
    await delay(100)
    this.props.dispatch(updateGameState(NEW_GAME_AVATAR_SELECTION))
  }
}

export default withTheme(NavigationToStart)

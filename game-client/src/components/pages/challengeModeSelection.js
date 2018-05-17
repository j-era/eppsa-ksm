import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"
import {
  delay,
  FramedIcon,
  NextButton,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import { joinChallengeLobby, selectChallengeType, updateGameState } from "../../actionCreators"
import * as gameStates from "../../gameStates"

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

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
`

const MultiplayerButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  width: 75%;
`

const SingleplayerButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  width: 75%;
`

class ChallengeModeSelection extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { multiplayerClicked: false, singleplayerClicked: false }
  }

  render() {
    const { assetServerUri, content, theme } = this.props

    return (
      <Container>
        <PageTitle>{ content.shared.texts.challengeModeSelectionTitle }</PageTitle>
        <Content>
          <FramedIcon
            scale={ 0.78 }
            color={ theme.colors.area }
            iconSrc={ `${assetServerUri}/${content.shared.assets.skillIcon.src}` } />
          <Buttons>
            <MultiplayerButton
              visible
              onClick={ this.onMultiplayer }
              clicked={ this.state.multiplayerClicked }
              text={ content.shared.texts.challengeModeSelectionMultiplayerButton } />
            <SingleplayerButton
              onClick={ this.onSingleplayer }
              clicked={ this.state.singleplayerClicked }
              text={ content.shared.texts.challengeModeSelectionSingleplayerButton } />
          </Buttons>
        </Content>
      </Container>
    )
  }

  async onMultiplayer() {
    this.setState({ multiplayerClicked: true })
    await delay(100)

    const { challengeName, content, assetServerUri, gameServerUri, staticServerUri } = this.props
    this.props.dispatch(selectChallengeType(challengeName, content, assetServerUri, gameServerUri, staticServerUri))
  }

  async onSingleplayer() {
    this.setState({ singleplayerClicked: true })
    await delay(100)
    this.props.dispatch(updateGameState(gameStates.CHALLENGE_SELECTION))
  }
}

export default withTheme(ChallengeModeSelection)

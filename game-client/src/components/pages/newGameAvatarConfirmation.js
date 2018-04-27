import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"

import {
  Button,
  delay,
  Description,
  FramedIcon,
  NextButton,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import { updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_SELECTION, NEW_GAME_NAME_SELECTION } from "../../gameStates"

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

class NewGameAvatarConfirmation extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { nextClicked: false, backClicked: false }
  }

  render() {
    const { assetServerUri, avatar, content } = this.props

    return (
      <Container>
        <PageTitle text={ content.avatars[avatar].name } />
        <Content>
          <FramedIcon
            scale={0.78}
            color={ this.props.theme.colors.primary }
            iconSrc={ `${assetServerUri}/${content.avatars[avatar].medium.src}` }
            iconSrcSet={ `${assetServerUri}/${content.avatars[avatar].small.src} 250w,
                          ${assetServerUri}/${content.avatars[avatar].medium.src} 500w,
                          ${assetServerUri}/${content.avatars[avatar].large.src} 1000w` } />
          <StyledDescription>{ content.avatars[avatar].description }</StyledDescription>
          <Buttons>
            <ConfirmButton
              visible
              onClick={ this.confirm }
              clicked={ this.state.nextClicked }
              text={ content.shared.texts.toPlayerName } />
            <BackButton
              onClick={ this.back }
              clicked={ this.state.backClicked }>
              { content.shared.texts.back }
            </BackButton>
          </Buttons>
        </Content>
      </Container>
    )
  }

  async confirm() {
    this.setState({ nextClicked: true })
    await delay(100)
    this.props.dispatch(updateGameState(NEW_GAME_NAME_SELECTION))
  }

  async back() {
    this.setState({ backClicked: true })
    await delay(100)
    this.props.dispatch(updateGameState(NEW_GAME_AVATAR_SELECTION))
  }
}

export default withTheme(NewGameAvatarConfirmation)

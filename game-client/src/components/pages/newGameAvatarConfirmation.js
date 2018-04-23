import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"

import { updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_SELECTION, NEW_GAME_NAME_SELECTION } from "../../gameStates"
import {
  Button,
  delay,
  FramedIcon,
  NextButton,
  PageTitle
} from "../../../node_modules/eppsa-ksm-shared"

const Container = styled.div `
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Content = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const StyledFramedIcon = styled(FramedIcon)`
  margin-top: ${props => props.theme.layout.mediumSpacing};
`

const Description = styled.div`
  margin-top: ${props => props.theme.layout.smallSpacing};
  height: calc(3em + ${props => props.theme.layout.smallSpacing} * 2);
  font-size: ${props => props.theme.font.text.size};
  font-weight: ${props => props.theme.font.text.weight};
  color: ${props => props.theme.font.text.color};
  text-align: center;
`

const ConfirmButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing};
  border-color: ${props => props.theme.colors.areaColor};
`

const BackButton = styled(Button)`
  margin-top: ${props => props.theme.layout.smallSpacing};
  align-self: center;
  border-color: ${props => props.theme.colors.secondary};
`

export default class NewGameAvatarConfirmation extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { nextClicked: false, backClicked: false }
  }

  render() {
    const { assetServerUri, avatar, content } = this.props

    return (
      <Container>
        <PageTitle text={ avatar } />
        <Content>
          <StyledFramedIcon icon={ `${assetServerUri}/${content.avatars[avatar].medium.src}` } />
          <Description>{ content.avatars[avatar].description }</Description>
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

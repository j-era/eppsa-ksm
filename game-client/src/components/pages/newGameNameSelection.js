import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { FramedIcon, NextButton, PageTitle, delay } from "eppsa-ksm-shared"

import { updateName, startNewGame } from "../../actionCreators"

const Container = styled.div `
  font-family: ${props => props.theme.font.fontFamily};
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Content = styled.div `
  font-family: ${props => props.theme.font.fontFamily};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const StyledFramedIcon = styled(FramedIcon)`
  margin-top: ${props => props.theme.layout.mediumSpacing};
`

const NameInputContainer = styled.div `
  margin-top: ${props => props.theme.layout.largeSpacing};
  padding-top: 0.8em;
  padding-bottom: 0.8em;
  padding-left: 1em;
  padding-right: 1em;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: ${props => props.theme.layout.borderRadius};
  border-style: solid;
  border-width: ${props => props.theme.layout.buttonBorder};
  border-color: ${props => props.theme.colors.primary};
  text-align: center;
  display: flex;
  align-self: center;
  justify-content: center;
`

const NameInput = styled.input`
  ::placeholder {
    color: ${props => props.theme.colors.primary};
    opacity: 0.6;
  }
  :focus {
    outline: none;
  }
  :focus::placeholder {
    opacity: 0;
  }
  border-width: 0;
  width: 100%;
  text-align: center;
  font-size: ${props => props.theme.font.button.size};
  font-weight: ${props => props.theme.font.button.weight};
`

const ConfirmButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing};
  border-color: ${props => props.theme.colors.secondary};
  opacity: ${props => props.active ? 1 : 0.5};
`

export default class NewGameNameSelection extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { confirmed: false, nameEntered: false }
  }

  render() {
    const {
      assetServerUri,
      avatar,
      content,
      gameServer,
      name,
      maxChallenges
    } = this.props

    return (
      <Container>
        <PageTitle text={ content.shared.texts.selectName } />
        <Content>
          <StyledFramedIcon icon={ `${assetServerUri}/${content.avatars[avatar].icon.src}` } />
          <NameInputContainer>
            <NameInput
              type="text"
              maxLength="12"
              value={ name }
              placeholder={ content.shared.texts.selectNamePlaceholder }
              onChange={ this.onInput } />
          </NameInputContainer>
          <ConfirmButton
            visible
            active={ this.state.nameEntered }
            onClick={ this.state.nameEntered
              ? () => this.confirm(name, avatar, maxChallenges, gameServer)
              : () => {}
            }
            clicked={ this.state.confirmed }
            text={ content.shared.texts.confirm } />
        </Content>
      </Container>
    )
  }

  onInput(event) {
    if (event.target.value.length > 2) {
      if (!this.state.nameEntered) {
        this.setState({ nameEntered: true })
      }
    } else {
      if (this.state.nameEntered) {
        this.setState({ nameEntered: false })
      }
    }

    this.props.dispatch(updateName(event.target.value))
  }

  async confirm(name, avatar, maxChallenges, gameServer) {
    this.setState({ confirmed: true })
    await delay(100)
    this.props.dispatch(startNewGame(name, avatar, maxChallenges, gameServer))
  }
}

import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"
import { FramedIcon, NextButton, Page, PageTitle, delay } from "eppsa-ksm-shared"

import { updateName, updateGameState } from "../../actionCreators"
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

const NameInputContainer = styled.div `
  font-size: ${props => props.theme.font.button.size}vw;
  margin-top: ${props => props.theme.layout.largeSpacing}vw;
  padding: 0.7em 1em;
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
  font-size: ${props => props.theme.font.button.size}vw;
  font-weight: ${props => props.theme.font.button.weight};
`

const ConfirmButton = styled(NextButton)`
  margin-top: ${props => props.theme.layout.mediumSpacing};
  border-color: ${props => props.theme.colors.secondary};
  opacity: ${props => props.active ? 1 : 0.3};
`

class NewGameNameSelection extends React.Component {
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
      name
    } = this.props

    return (
      <Container>
        <PageTitle>{ content.shared.texts.selectName }</PageTitle>
        <Content>
          <FramedIcon
            scale={ 0.78 }
            color={ this.props.theme.colors.primary }
            iconSrc={ `${assetServerUri}/${content.avatars[avatar].medium.src}` }
            iconSrcSet={ `${assetServerUri}/${content.avatars[avatar].small.src} 250w,
                          ${assetServerUri}/${content.avatars[avatar].medium.src} 500w,
                          ${assetServerUri}/${content.avatars[avatar].large.src} 1000w` } />
          <NameInputContainer>
            <form onSubmit={ this.onSubmit }>
              <NameInput
                required
                type="text"
                maxLength="12"
                value={ name }
                placeholder={ content.shared.texts.selectNamePlaceholder }
                onChange={ this.onInput } />
            </form>
          </NameInputContainer>
          <ConfirmButton
            visible
            active={ this.state.nameEntered }
            onClick={ this.state.nameEntered
              ? () => this.confirm()
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

  onSubmit(event) {
    event.preventDefault()
    this.confirm()
  }

  async confirm() {
    this.setState({ confirmed: true })
    await delay(100)
    this.props.dispatch(updateGameState(gameStates.INITIAL_GAME_MANUAL))
  }
}

export default withTheme(NewGameNameSelection)

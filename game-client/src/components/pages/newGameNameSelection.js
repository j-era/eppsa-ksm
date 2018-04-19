import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"

import { updateName, startNewGame } from "../../actionCreators"

import delay from "../../../node_modules/eppsa-ksm-shared/functions/delay"
import FramedIcon from "../../../node_modules/eppsa-ksm-shared/styled-components/components/framedIcon"
import NextButton from "../../../node_modules/eppsa-ksm-shared/styled-components/components/nextButton"
import PageTitle from "../../../node_modules/eppsa-ksm-shared/styled-components/components/pageTitle"


const Container = styled.div `
  font-family: ${props => props.theme.font.fontFamily};
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

const StyledFramedIcon = styled(FramedIcon)`
  margin-top: ${props => props.theme.layout.smallSpacing};
`

const NameInputContainer = styled.div `
  margin-top: ${props => props.theme.layout.largeSpacing};
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  padding-left: 1em;
  padding-right: 1em;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: ${props => props.theme.layout.borderRadius};
  border-style: solid;
  border-width: ${props => props.theme.layout.buttonBorder};
  border-color: ${props => props.theme.colors.areaColor};
  text-align: center;
  display: flex;
  align-self: center;
  justify-content: center;
`

const NameInput = styled.input`
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
        <PageTitle text="Wähle deinen Namen!" />
        <StyledFramedIcon icon={ `${assetServerUri}/${content.avatars[avatar].icon.src}` } />
        <NameInputContainer>
          <NameInput
            type="text"
            value={ name }
            placeholder="Spielername eingeben"
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
          text="Bestätigen" />
      </Container>
    )
  }

  onInput(event) {
    if (!this.state.nameEntered) {
      this.setState({ nameEntered: true })
    }
    this.props.dispatch(updateName(event.target.value))
  }

  async confirm(name, avatar, maxChallenges, gameServer) {
    this.setState({ confirmed: true })
    await delay(100)
    this.props.dispatch(startNewGame(name, avatar, maxChallenges, gameServer))
  }
}

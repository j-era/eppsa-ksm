import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"

import { updateName, startNewGame } from "../../actionCreators"

import FramedIcon from "../../../node_modules/eppsa-ksm-shared/styled-components/components/framedIcon"
import Button from "../../../node_modules/eppsa-ksm-shared/styled-components/components/button"
import delay from "../../../node_modules/eppsa-ksm-shared/functions/delay"
import NextButton from "../../../node_modules/eppsa-ksm-shared/styled-components/components/nextButton"


const Container = styled.div `
  font-family: ${props => props.theme.font.fontFamily};
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: ${props => props.theme.layout.offsetX};
  padding-right: ${props => props.theme.layout.offsetX};
  height: 100%;
  width: 100%;
`

const ConfirmButton = styled(NextButton)`
  border-color: ${props => props.theme.colors.secondary};
`

const NameInputContainer = styled(Button)`
  padding-left: 2em;
  padding-right: 2em;
`

const NameInput = styled.input`
  width: 100%;
  text-align: center;
`

export default class NewGameNameSelection extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { confirmed: false }
  }

  render() {
    const {
      assetServerUri,
      avatar,
      content,
      dispatch,
      gameServer,
      name,
      maxChallenges
    } = this.props

    return (
      <Container>
        <FramedIcon icon={ `${assetServerUri}/${content.avatars[avatar].icon.src}` } />
        <NameInputContainer>
          <NameInput
            type="text"
            value={ name }
            placeholder="Spielername eingeben"
            onChange={ event => dispatch(updateName(event.target.value)) } />
        </NameInputContainer>
        <ConfirmButton
          visible
          onClick={ () => this.confirm(name, avatar, maxChallenges, gameServer) }
          clicked={ this.state.confirmed }
          text="Bestätigen" />
      </Container>
    )
  }

  async confirm(name, avatar, maxChallenges, gameServer) {
    this.setState({ confirmed: true })
    await delay(100)
    this.props.dispatch(startNewGame(name, avatar, maxChallenges, gameServer))
  }
}

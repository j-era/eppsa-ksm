import React from "react"
import styled from "styled-components"

import { updateName, startNewGame } from "../../actionCreators"

import FramedIcon from "../../../node_modules/eppsa-ksm-shared/styled-components/components/framedIcon"
import Button from "../../../node_modules/eppsa-ksm-shared/styled-components/components/button"
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

export default function NewGameNameSelection(props) {
  const { assetServerUri, avatar, content, dispatch, gameServer, name, maxChallenges } = props

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
        onClick={ () => dispatch(startNewGame(name, avatar, maxChallenges, gameServer)) }
        text="Bestätigen" />
    </Container>
  )
}

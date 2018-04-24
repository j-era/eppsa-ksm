import React from "react"
import styled from "styled-components"

import { Description, PageTitle, QrReader } from "eppsa-ksm-shared"

import {
  handleQrReaderError,
  handleAvatarQrCode,
  updateAvatar,
  updateGameState
} from "../../actionCreators"
import { NEW_GAME_AVATAR_CONFIRMATION } from "../../gameStates"


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

const AvatarContainer = styled.div`
  margin-top: ${props => props.theme.layout.smallSpacing};
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Avatar = styled.div`
  width: 20%;
  height: 23vw;
  background-image: url(${props => props.icon});
  background-position-x: center;
  background-size: auto 100%;
`

export default function NewGameAvatarSelection(props) {
  const { assetServerUri, content, dispatch } = props

  return (
    <Container>
      <PageTitle text={ content.shared.texts.selectAvatar } />
      <Content>
        <AvatarContainer>
          {
            Object.keys(content.avatars)
              .slice(0, 5)
              .map(avatar => renderAvatarSelector(avatar, content, dispatch, assetServerUri))
          }
        </AvatarContainer>
        <QrReader
          onScan={ data => dispatch(handleAvatarQrCode(data)) }
          onError={ (error) => dispatch(handleQrReaderError(error)) } />
        <Description>{ content.shared.texts.selectAvatarInstructions }</Description>
      </Content>
    </Container>
  )
}

function renderAvatarSelector(avatar, content, dispatch, assetServerUri) {
  return (
    <Avatar
      key={ avatar }
      icon={ `${assetServerUri}/${content.avatars[avatar].medium.src}` }
      onClick={ () => {
        dispatch(updateAvatar(avatar))
        dispatch(updateGameState(NEW_GAME_AVATAR_CONFIRMATION))
      } } />
  )
}

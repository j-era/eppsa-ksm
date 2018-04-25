import React from "react"
import styled, { withTheme } from "styled-components"

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
  height: ${props => props.theme.layout.cardwidth * 0.2}vw;
`

export default withTheme(NewGameAvatarSelection)

function NewGameAvatarSelection(props) {
  const { assetServerUri, content, dispatch } = props
  console.log(process.env.NODE_ENV)

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
          seekerColor={ props.theme.colors.primary }
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
      onClick={ process.env.NODE_ENV === "development"
        ? () => {
          dispatch(updateAvatar(avatar))
          dispatch(updateGameState(NEW_GAME_AVATAR_CONFIRMATION))
        }
        : () => {} }>
      <img
        height="100%"
        src={ `${assetServerUri}/${content.avatars[avatar].medium.src}` }
        srcSet={ `${assetServerUri}/${content.avatars[avatar].small.src} 250w,
                  ${assetServerUri}/${content.avatars[avatar].medium.src} 500w,
                  ${assetServerUri}/${content.avatars[avatar].large.src} 1000w` } />
    </Avatar>
  )
}

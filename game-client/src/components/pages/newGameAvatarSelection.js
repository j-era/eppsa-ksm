import React from "react"
import ReactQrReader from "react-qr-reader"
import styled from "styled-components"

import { handleQrReaderError, updateAvatar, updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_CONFIRMATION } from "../../gameStates"
import { PageTitle } from "../../../node_modules/eppsa-ksm-shared"


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

const StyledQrReader = styled(ReactQrReader)`
  width: 100px;
  height: 100px;
  align-self: center;
`

const Description = styled.div`
  margin-top: ${props => props.theme.layout.smallSpacing};
  height: calc(3em + ${props => props.theme.layout.smallSpacing} * 2);
  font-size: ${props => props.theme.font.text.size};
  font-weight: ${props => props.theme.font.text.weight};
  color: ${props => props.theme.font.text.color};
  text-align: center;
`

const AvatarContainer = styled.div`
  display: flex;
  width: 100%;
`

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  background-image: url(${props => props.icon});
  background-size: cover;
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
        <StyledQrReader
          onScan={ () => {} }
          onError={ (error) => dispatch(handleQrReaderError(error)) }
          showViewFinder={ false } />
        <Description>{ content.shared.texts.selectAvatarInstructions }</Description>
      </Content>
    </Container>
  )
}

function renderAvatarSelector(avatar, content, dispatch, assetServerUri) {
  return (
    <Avatar
      key={ avatar }
      icon={ `${assetServerUri}/${content.avatars[avatar].icon.src}` }
      onClick={ () => {
        dispatch(updateAvatar(avatar))
        dispatch(updateGameState(NEW_GAME_AVATAR_CONFIRMATION))
      } } />
  )
}

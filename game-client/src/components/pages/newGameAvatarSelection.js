import React from "react"
import ReactQrReader from "react-qr-reader"
import styled from "styled-components"

import { handleQrReaderError, updateAvatar, updateGameState } from "../../actionCreators"
import { NEW_GAME_AVATAR_CONFIRMATION } from "../../gameStates"
import { PageTitle } from "../../../node_modules/eppsa-ksm-shared"
import QrReaderSeeker from "../../../node_modules/eppsa-ksm-shared/assets/EPPSA_Assets_QR-Code_Scanner.svg"


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

const QrReaderContainer = styled.div`
  width: 40vw;
  height: 40vw;
  padding: ${props => props.theme.layout.largeSpacing};
  align-self: center;
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.layout.cardBorderRadius};
`

const StyledQrReaderSeeker = styled(QrReaderSeeker)`
  position: absolute;
  z-index: 2;
  width: 40vw;
  height: 40vw;
  fill: ${props => props.theme.colors.primary};
`

const StyledQrReader = styled(ReactQrReader)`
  position: absolute;
  transform: translate(
    -${props => props.theme.layout.mediumSpacing},
    -${props => props.theme.layout.mediumSpacing}
  );
  width: calc(40vw + ${props => props.theme.layout.mediumSpacing} * 2);
  height: calc(40vw + ${props => props.theme.layout.mediumSpacing} * 2);
`

const Description = styled.div`
  font-size: ${props => props.theme.font.text.size};
  font-weight: ${props => props.theme.font.text.weight};
  color: ${props => props.theme.font.text.color};
  text-align: center;
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
        <QrReaderContainer>
          <StyledQrReaderSeeker />
          <StyledQrReader
            onScan={ () => {} }
            onError={ (error) => dispatch(handleQrReaderError(error)) }
            showViewFinder={ false } />
        </QrReaderContainer>
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

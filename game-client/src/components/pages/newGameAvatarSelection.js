import React from "react"
import styled, { withTheme } from "styled-components"

import { Description, ErrorMessage, Page, PageTitle, QrReader } from "eppsa-ksm-shared"

import {
  handleQrReaderError,
  handleAvatarQrCode,
  updateAvatar,
  updateGameState
} from "../../actionCreators"
import { NEW_GAME_AVATAR_CONFIRMATION } from "../../gameStates"


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

const Avatars = styled.img`
  width: 100%;
`

export default withTheme(NewGameAvatarSelection)

function NewGameAvatarSelection(props) {
  const { assetServerUri, content, dispatch } = props
  console.log(process.env.NODE_ENV)

  return (
    <Container>
      <PageTitle text={ content.shared.texts.selectAvatar } />
      <Content>
        <Avatars
          onClick={ process.env.NODE_ENV === "development"
            ? () => {
              dispatch(updateAvatar("airplane"))
              dispatch(updateGameState(NEW_GAME_AVATAR_CONFIRMATION))
            }
            : () => {} }
          src={ `${assetServerUri}/${content.shared.assets.avatarsMedium.src}` }
          srcSet={ `${assetServerUri}/${content.shared.assets.avatarsSmall.src} 250w,
                    ${assetServerUri}/${content.shared.assets.avatarsMedium.src} 500w,
                    ${assetServerUri}/${content.shared.assets.avatarsLarge.src} 1000w` } />
        <QrReader
          size={ 0.7 }
          seekerColor={ props.theme.colors.primary }
          onScan={ data => dispatch(handleAvatarQrCode(data)) }
          onError={ (error) => dispatch(handleQrReaderError(error)) } />
        {
          props.wrongQrCodeScanned
            ? <ErrorMessage>{ content.shared.texts.selectAvatarErrorInstructions }</ErrorMessage>
            : <Description>{ content.shared.texts.selectAvatarInstructions }</Description>
        }
      </Content>
    </Container>
  )
}

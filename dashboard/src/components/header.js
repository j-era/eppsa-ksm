import React from "react"
import styled from "styled-components"

import GameBoard from "./gameBoard"

const Container = styled.div`
  width: 100%;
  height: 22%;
  padding: 2%;
  box-sizing: border-box;

`

const PaddedContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`

const Logo = styled.img`
  height: 100%;
`

export default function Header({ assetServerUri, content, connectedGames }) {
  return (
    <Container>
      <PaddedContainer>
        <Logo src={ `${assetServerUri}/${content.shared.assets.logo.src}` } />
        {
          <GameBoard
            content={ content }
            connectedGames={ connectedGames }
            assetServerUri={ assetServerUri } />
        }
      </PaddedContainer>
    </Container>
  )
}


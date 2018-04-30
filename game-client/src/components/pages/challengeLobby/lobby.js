import React from "react"
import autoBind from "react-autobind"
import styled, { withTheme } from "styled-components"

import {
  Button,
  delay,
  Description,
  FramedIcon,
  Page,
  PageTitle
} from "eppsa-ksm-shared"

import {
  requestMate,
  leaveChallengeLobby
} from "../../../actionCreators"

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

const Games = styled.div `
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;
`

const Game = styled.div `
  padding: 5%;
  width: 40%;
`

const StyledDescription = styled(Description)`
  margin-top: ${props => props.theme.layout.smallSpacing}vw;
  max-height: calc(3em + ${props => props.theme.layout.smallSpacing}vw);
`

const BackButton = styled(Button)`
  margin-top: ${props => props.theme.layout.mediumSpacing}vw;
  align-self: center;
  border-color: ${props => props.theme.colors.secondary};
`

class NewGameAvatarConfirmation extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { backClicked: false }
  }

  render() {
    const { challengeNumber, connectedGames, content, dispatch, gameId, gameServer } = this.props
    const gamesInLobby = findGamesInLobby(challengeNumber, connectedGames, gameId)

    return (
      <Container>
        <PageTitle>{ content.shared.texts.lobbyTitle }</PageTitle>
        <Content>
          { gamesInLobby.length > 0 ?
            <Games>{ gamesInLobby.map(this.renderGame) }</Games> :
            <Description>{ content.shared.texts.lobbyIsEmpty }</Description>
          }
          <BackButton
            onClick={ this.back }
            clicked={ this.state.backClicked }>
            { content.shared.texts.back }
          </BackButton>
        </Content>
      </Container>
    )
  }

  renderGame(game) {
    const { assetServerUri, content, dispatch, gameServer } = this.props

    return (
      <Game
        key={ game.gameId }
        onClick={ () => dispatch(requestMate(game.gameId, game.name, gameServer)) }>
        <FramedIcon
          color={ this.props.theme.colors.area }
          iconSrc={ `${assetServerUri}/${content.avatars[game.avatar].medium.src}` }
          iconSrcSet={ `${assetServerUri}/${content.avatars[game.avatar].small.src} 250w,
                        ${assetServerUri}/${content.avatars[game.avatar].medium.src} 500w,
                        ${assetServerUri}/${content.avatars[game.avatar].large.src} 1000w` } />
        <Description>{ game.name }</Description>
      </Game>
    )
  }

  async back() {
    this.setState({ backClicked: true })
    await delay(100)
    this.props.dispatch(leaveChallengeLobby(this.props.gameServer))
  }
}

export default withTheme(NewGameAvatarConfirmation)

function findGamesInLobby(challengeNumber, connectedGames, gameId) {
  return connectedGames.filter((game) =>
    gameId !== game.gameId && challengeNumber === game.challengeNumber && game.inLobby
  )
}


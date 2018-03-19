import styled from "styled-components"
import React from "react"

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 10vw;
  
  font-family: 'Tangerine', serif;
  font-size: 8vw;
`

const EnterName = styled.input`
  &::placeholder {
    color: grey;
    font-family: 'Tangerine', serif;
  }
  
  &:focus {
    outline: none;
  }
  
  display: flex;
  
  text-align: center;
  
  font-family: 'Tangerine', serif;
  font-weight: bold;  
  font-size: 8vw;
  
  margin-left: 10vw;
  margin-right: 10vw;
  margin-bottom: 5vw;
`

const Description = styled.div`
  margin-bottom: 10vw;
`

const PlayWith = styled.div`
  margin-bottom: 5vw;
`

const PlayerListItem = styled.div`
  display: flex;
  margin-left: 10vw;
  margin-right: 10vw;
  margin-bottom: 5vw;

`

const Player = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 8vw;
`

const IncomingRequest = styled.div`
  color: forestgreen;
  border: 1px solid black;
  border-radius: 50%;
  width: 10vw;
  height: 10vw;
  text-align: center;
  font-size: 10vw;
  
  margin-left: 5vw;
`
const OutgoingRequest = styled.div`
  color: gray;
  border: 1px solid black;
  border-radius: 50%;
  width: 10vw;
  height: 10vw;
  text-align: center;
  font-size: 10vw;
  
  margin-left: 5vw;
`


export default class Lobby extends React.Component {
  constructor(props) {
    super(props)

    this.server = props.server
    this.content = props.content

    this.state = {
      player: {},
      game: this.content,
      waitingPlayers: [],
      requestFrom: [],
      requestTo: null
    }

    this.server.on("init", player => {
      this.setState({
        player,
        givenName: player.name
      })
    })

    this.server.on("players", waitingPlayers => {
      waitingPlayers.splice(waitingPlayers.findIndex(player => this.isSamePlayer(player)), 1)
      this.setState({
        waitingPlayers
      })
    })

    this.server.on("playRequest", player => {
      const requestFrom = Array.from(this.state.requestFrom)
      requestFrom.push(player)
      this.setState({
        requestFrom
      })
      console.log(`${player.id} wants to play with you: ${this.state.requestFrom}`)
    })

    this.server.on("cancelPlayRequest", (player) => {
      const requestFrom = Array.from(this.state.requestFrom).filter(
        (request) => request.id !== player.id
      )
      this.setState({
        requestFrom
      })
    })
  }

  render() {
    return (
      <Container>
        Dear
        <EnterName
          type="text"
          placeholder= { this.state.player.name }
          onChange={ event => { this.setName(event) } } />
        <Description>
          {this.state.game.description}
        </Description>
        <PlayWith>Play with</PlayWith>
        {
          this.state.waitingPlayers.map(
            player =>
              <PlayerListItem key={ player.id } >
                <Player onClick={ () => this.requestToPlay(player) }>
                  {player.name}
                </Player>
                {
                  this.state.requestFrom.filter(from => from.id === player.id).length > 0 &&
                  <IncomingRequest onClick={ () => this.acceptInvite(player) }>
                  ?
                  </IncomingRequest>
                }
                {
                  this.state.requestTo && this.state.requestTo.id === player.id &&
                  <OutgoingRequest>
                    !
                  </OutgoingRequest>
                }
              </PlayerListItem>
          )
        }
      </Container>
    )
  }

  setName(event) {
    const name = event.target.value.trim().substr(0, 25) || this.state.givenName

    this.server.setName(name)
  }

  isSamePlayer(otherPlayer) {
    return otherPlayer.id === this.state.player.id
  }

  acceptInvite(player) {
    this.server.acceptInvite(player)
  }

  requestToPlay(player) {
    if (this.state.requestTo) {
      this.server.cancelRequestToPlay(this.state.requestTo)
    }
    this.server.playWith(player)
    this.setState({
      requestTo: player
    })
  }
}

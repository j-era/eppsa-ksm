import React from "react"

import {
  acceptMateRequest,
  rejectMateRequest,
  requestMate,
  cancelRequestMate,
  leaveChallengeLobby
} from "../../actionCreators"

export default class ChallengeLobby extends React.Component {
  static getDerivedStateFromProps(nextProps, { requestedMate, mateRequest, mateHasRejected }) {
    const newRequestedMate = nextProps.requestedMate
    const newMateHasRejected = newRequestedMate === null && requestedMate !== null

    const shouldUpdateMateRequest = !mateRequest || !nextProps.mateRequests.has(mateRequest)
    const newMateRequest = shouldUpdateMateRequest
      ? nextProps.mateRequests.values().next().value
      : mateRequest

    return {
      requestedMate: newRequestedMate,
      mateRequest: newMateRequest,
      mateHasRejected: mateHasRejected || newMateHasRejected
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      requestedMate: null,
      mateRequest: null,
      mateHasRejected: false
    }
  }

  render() {
    if (this.state.requestedMate) {
      return this.renderWaitingForRequestedMate()
    }

    if (this.state.mateHasRejected) {
      return this.renderMateHasRejected()
    }

    if (this.state.mateRequest) {
      return this.renderMateRequest()
    }

    return this.renderLobbyList()
  }

  renderWaitingForRequestedMate() {
    const { challengeNumber, connectedGames, dispatch, gameServer } = this.props
    const { requestedMate } = this.state

    const mateData = connectedGames.find((game) =>
      requestedMate === game.gameId && challengeNumber === game.challengeNumber && game.inLobby)

    return (
      <div>
        <div>ChallengeLobby</div>
        {
          mateData ? "Warte auf Zustimmung." : "Der Spieler hat die Lobby verlassen."
        }
        <button onClick={ () => {
          this.setState({ requestedMate: null })
          dispatch(cancelRequestMate(gameServer))
        } }>
          Zurück
        </button>
      </div>
    )
  }

  renderMateHasRejected() {
    return (
      <div>
        <div>ChallengeLobby</div>
        {
          "Der Spieler hat abgelehnt."
        }
        <button onClick={ () => {
          this.setState({ mateHasRejected: false })
        } }>
          Zurück
        </button>
      </div>
    )
  }

  renderMateRequest() {
    const { mateRequest } = this.state
    const { gameServer, dispatch } = this.props

    return (
      <div>
        <div>ChallengeLobby</div>
        { "Jemand möchte mit dir spielen." }
        <button onClick={ () => dispatch(rejectMateRequest(mateRequest, gameServer)) }>
          Ablehnen
        </button>
        <button onClick={ () => dispatch(acceptMateRequest(mateRequest, gameServer)) }>
          Annehmen
        </button>
      </div>
    )
  }

  renderLobbyList() {
    const { challengeNumber, connectedGames, dispatch, gameId, gameServer } = this.props
    const gamesInLobby = findGamesInLobby(challengeNumber, connectedGames, gameId)

    return (
      <div>
        <div>ChallengeLobby</div>
        <div>
          {
            gamesInLobby.map((game) =>
              <button
                key={ game.gameId }
                onClick={ () => dispatch(requestMate(game.gameId, gameServer)) }>
                { game.name }
              </button>
            )
          }
        </div>
        <button onClick={ () => dispatch(leaveChallengeLobby(gameServer)) }>
          Zurück
        </button>
      </div>
    )
  }
}

function findGamesInLobby(challengeNumber, connectedGames, gameId) {
  return connectedGames.filter((game) =>
    gameId !== game.gameId && challengeNumber === game.challengeNumber && game.inLobby
  )
}

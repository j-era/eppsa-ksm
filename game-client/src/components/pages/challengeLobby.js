import React from "react"

import { leaveChallengeLobby } from "../../actionCreators"

// class ChallengeLobby extends React.Component {
//   componentWillMount()

//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }

export default function ChallengeLobby(props) {
  const gamesInLobby = props.connectedGames.filter((game) =>
    game.gameId !== props.gameId && game.challengeNumber === props.challengeNumber && game.inLobby
  )

  return (
    <div>
      <div>ChallengeLobby</div>
      {
        gamesInLobby.map((game) => 
          <button
            key={ game.gameId }
            onClick={ () => props.dispatch(leaveChallengeLobby(props.gameServer)) }>
            { game.name }
          </button>
        )
      }
      <button onClick={ () => props.dispatch(leaveChallengeLobby(props.gameServer)) }>
        Zurück
      </button>
    </div>
  )
}

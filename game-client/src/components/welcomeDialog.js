import React from "react"

export default class WelcomeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { decidedToStartNew: props.previousGame === null }
  }

  render() {
    return this.state.decidedToStartNew ? this.renderStartNewGame() : this.renderResumeGame()
  }

  renderResumeGame() {
    const { assetServerUri, avatars, maxChallenges, previousGame, onResumeGame } = this.props
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[previousGame.avatar].icon.src}` } />
        <div>{ previousGame.name }</div>
        <button onClick={ () => onResumeGame(previousGame.gameId, maxChallenges) }>Resume</button>
        <button onClick={ () => this.setState({decidedToStartNew: true}) }>Start New Game</button>
      </div>
    )
  }

  renderStartNewGame() {
    const {
      assetServerUri,
      avatars,
      avatar,
      name,
      onStartNewGame,
      onUpdateName,
      maxChallenges
    } = this.props
    
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[avatar].icon.src}` } />
        <input type="text" value={ name } onChange={ event => onUpdateName(event.target.value) } />
        <button onClick={ () => onStartNewGame(name, avatar, maxChallenges) }>Start</button>
      </div>
    )
  }
}

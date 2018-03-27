import React from "react"

export default class WelcomeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { startNewGame: props.previousGame === null || props.previousGame.finished }
  }

  render() {
    return this.state.startNewGame ? this.renderStartNewGame() : this.renderResumeGame()
  }

  renderResumeGame() {
    const { assetServerUri, avatars, previousGame, onResumeGame } = this.props
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[previousGame.avatar].icon.src}` } />
        <div>{ previousGame.name }</div>
        <button onClick={ () => onResumeGame() }>Resume</button>
        <button onClick={ () => this.setState({ startNewGame: true }) }>Start New Game</button>
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
    } = this.props

    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[avatar].icon.src}` } />
        <input type="text" value={ name } onChange={ event => onUpdateName(event.target.value) } />
        <button onClick={ () => onStartNewGame(name, avatar) }>Start</button>
      </div>
    )
  }
}

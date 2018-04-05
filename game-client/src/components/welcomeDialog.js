import React from "react"

export default class WelcomeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startNewGame: props.previousGame === null || props.previousGame.finished,
      urlHasToken: props.urlHasToken
    }
  }

  render() {
    if (this.state.startNewGame && this.state.urlHasToken) {
      return this.renderLobbyNavigation()
    } else if (this.state.startNewGame) {
      return this.renderStartNewGame()
    } else {
      return this.renderResumeGame()
    }
  }

  renderLobbyNavigation() {
    const { lobbyNavigation } = this.props.content
    return (
      <div>
        { lobbyNavigation }
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

  renderResumeGame() {
    const { assetServerUri, avatars, previousGame, onResumeGame } = this.props
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[previousGame.avatar].icon.src}` } />
        <div>{ previousGame.name }</div>
        <button onClick={ () => onResumeGame() }>Resume</button>
        { !this.state.urlHasToken && <button onClick={ () => this.setState({ startNewGame: true }) }>Start New Game</button> }
      </div>
    )
  }
}

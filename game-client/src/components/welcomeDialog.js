import React from "react"

export default class WelcomeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startNewGame: props.resumableGame === null
    }
  }

  render() {
    return this.state.startNewGame ? this.renderStartNewGame() : this.renderResumeGame()
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
    const { assetServerUri, avatars, resumableGame, onResumeGame } = this.props
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[resumableGame.avatar].icon.src}` } />
        <div>{ resumableGame.name }</div>
        <button onClick={ () => onResumeGame() }>Resume</button>
        {
          !this.state.urlHasToken &&
          <button onClick={
            () => this.setState({ startNewGame: true }) }>
          Start New Game
          </button> }
      </div>
    )
  }
}

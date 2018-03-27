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
    const { assetServerUri, avatars, previousGame, onResumeGame } = this.props
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[previousGame.avatar].icon.src}` } />
        <div>{ previousGame.name }</div>
        <button onClick={ () => onResumeGame() }>Resume</button>
        <button onClick={ () => this.setState({ decidedToStartNew: true }) }>Start New Game</button>
      </div>
    )
  }

  renderStartNewGame() {
    const {
      assetServerUri,
      avatars,
      selectedAvatar,
      name,
      onStartNewGame,
      onUpdateName,
    } = this.props

    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[selectedAvatar].icon.src}` } />
        <input type="text" value={ name } onChange={ event => onUpdateName(event.target.value) } />
        <button onClick={ () => onStartNewGame(name, selectedAvatar) }>Start</button>
      </div>
    )
  }
}

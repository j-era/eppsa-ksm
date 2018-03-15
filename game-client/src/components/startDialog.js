import React from "react"

export default class StartDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { decidedToStartNew: props.previousGameInfo === null }
  }

  render() {
    return this.state.decidedToStartNew ? this.renderStartNewGame() : this.renderResumeGame()
  }

  renderResumeGame() {
    const { assetServerUri, avatars, previousGameInfo, onResumeGame } = this.props
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[previousGameInfo.avatar].icon.src}` } />
        <div>{ previousGameInfo.name }</div>
        <button onClick={ () => onResumeGame(previousGameInfo.gameId) }>Resume</button>
        <button onClick={ () => this.setState({decidedToStartNew: true}) }>Start New Game</button>
      </div>
    )
  }

  renderStartNewGame() {
    const { assetServerUri, avatars, avatar, name, onStartNewGame, onUpdateName } = this.props
    return (
      <div>
        <img src={ `${assetServerUri}/${avatars[avatar].icon.src}` } />
        <input type="text" value={ name } onChange={ event => onUpdateName(event.target.value) } />
        <button onClick={ () => onStartNewGame(name, avatar) }>Start</button>
      </div>
    )
  }
}

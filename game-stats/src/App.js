import React from "react"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startedGames: 0,
      finishedGames: 0,
      challenges: []
    }
  }

  componentDidMount() {
    this.props.client.on("connect", () => {
      this.getStats()
    })
  }

  render() {
    return (
      <div>
        started games { this.state.startedGames.length }
        <br />
        finished games { this.state.finishedGames.length }
        {this.state.challenges.length > 0 && this.state.challenges.map(
          (challenge, index) =>
            <div key={ index }>
              challenge { index + 1 } started games: { challenge[0].length }
              <br />
              challenge { index + 1 } finished games: { challenge[1].length }
            </div>
        )}
      </div>
    )
  }

  async getStats() {
    console.log(`connected as ${this.props.client.id}`)

    const days = 7
    const dayInMilliseconds = 86400000
    const now = new Date()
    const then = new Date(now - days * dayInMilliseconds)

    const range = {
      from: then.toISOString(),
      to: now.toISOString()
    }

    const startedGames = await this.emitWithRepsonse("startedGamesInRange", range)
    const finishedGames = await this.emitWithRepsonse("finishedGamesInRange", range)

    const challenges = []

    for (let i = 0; i < 11; i ++) {
      const challengeNumber = i + 1

      const requests = []

      requests.push(this.emitWithRepsonse("startedChallengesInRange", range, challengeNumber))
      requests.push(this.emitWithRepsonse("finishedChallengesInRange", range, challengeNumber))

      challenges[i] = await Promise.all(requests)
    }

    this.setState({
      startedGames,
      finishedGames,
      challenges
    })
  }

  emitWithRepsonse(eventName, ...param) {
    return new Promise((resolve) => {
      this.props.client.emit(eventName, ...param, response => {
        resolve(response)
      })
    })
  }
}

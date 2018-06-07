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
        {
          this.state.challenges.size > 0 &&
          Array.from(this.state.challenges.keys())
            .sort((a, b) => a - b).map(
              challengeNumber =>
                <div key={ challengeNumber }>
                challenge { challengeNumber } started games:
                  { this.state.challenges.get(challengeNumber).length }
                </div>
            )
        }
        <br />
        {
          this.state.startedGames.length > 0 &&
          this.state.startedGames.map(game =>
            //game.challengeNumber === 1 ?
              <div key={ game.id }>
                agent: { game.userAgent } challange: { game.challengeNumber }
              </div>
              //: null
          )
        }

      </div>
    )
  }

  async getStats() {
    console.log(`connected as ${this.props.client.id}`)

    const days = 14
    const dayInMilliseconds = 86400000
    const now = new Date()
    const then = new Date(now - days * dayInMilliseconds)

    const range = {
      from: then.toISOString(),
      to: now.toISOString()
    }

    const startedGames = await this.emitWithRepsonse("startedGamesInRange", range)

    const finishedGames = startedGames.filter(game => game.finished)

    const challenges = new Map()

    startedGames.forEach(game => {
      if (challenges.has(game.challengeNumber)) {
        challenges.get(game.challengeNumber).push(game)
      } else {
        challenges.set(game.challengeNumber, [game])
      }
    })


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

import React from "react"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startedGames: 0,
      finishedGames: 0,
      challenges: [],
      operatingSystems: new Map()
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
        <br />
        <br />
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
          this.state.operatingSystems.has("Android") &&
          `Android: ${this.state.operatingSystems.get("Android").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("Android 4") &&
          `Android 4: ${this.state.operatingSystems.get("Android 4").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("Android 5") &&
          `Android 5: ${this.state.operatingSystems.get("Android 5").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("Android 6") &&
          `Android 6: ${this.state.operatingSystems.get("Android 6").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("Android 7") &&
          `Android 7: ${this.state.operatingSystems.get("Android 7").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("Android 8") &&
          `Android 8: ${this.state.operatingSystems.get("Android 8").length}`
        }
        <br />
        <br />
        {
          this.state.operatingSystems.has("iPhone OS") &&
          `iPhone OS ${this.state.operatingSystems.get("iPhone OS").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("iPhone OS 10") &&
          `iPhone OS 10 ${this.state.operatingSystems.get("iPhone OS 10").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("iPhone OS 11_2") &&
          `iPhone OS 11_2 ${this.state.operatingSystems.get("iPhone OS 11_2").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("iPhone OS 11_3") &&
          `iPhone OS 11_3 ${this.state.operatingSystems.get("iPhone OS 11_3").length}`
        }
        <br />
        {
          this.state.operatingSystems.has("iPhone OS 11_4") &&
          `iPhone OS 11_4 ${this.state.operatingSystems.get("iPhone OS 11_4").length}`
        }
      </div>
    )
  }

  async getStats() {
    console.log(`connected as ${this.props.client.id}`)

    const days = 21
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

    const operatingSystems = new Map()

    operatingSystems.set(
      "Android", this.filterForUserAgent(startedGames, "Android")
    )

    for (let i = 4; i <= 8; i++) {
      operatingSystems.set(
        `Android ${i}`, this.filterForUserAgent(startedGames, `Android ${i}`)
      )
    }

    operatingSystems.set(
      "iPhone OS", this.filterForUserAgent(startedGames, "iPhone OS")
    )

    operatingSystems.set(
      "iPhone OS 10", this.filterForUserAgent(startedGames, "iPhone OS 10")
    )

    operatingSystems.set(
      "iPhone OS 11_2", this.filterForUserAgent(startedGames, "iPhone OS 11_2")
    )

    operatingSystems.set(
      "iPhone OS 11_3", this.filterForUserAgent(startedGames, "iPhone OS 11_3")
    )

    operatingSystems.set(
      "iPhone OS 11_4", this.filterForUserAgent(startedGames, "iPhone OS 11_4")
    )


    this.setState({
      startedGames,
      finishedGames,
      challenges,
      operatingSystems
    })
  }

  emitWithRepsonse(eventName, ...param) {
    return new Promise((resolve) => {
      this.props.client.emit(eventName, ...param, response => {
        resolve(response)
      })
    })
  }

  filterForUserAgent(array, regExp) {
    return array.filter(
      item => item.userAgent.search(new RegExp(regExp, "g")) >= 0
    )
  }
}

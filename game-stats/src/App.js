import React from "react"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startedGames: 0,
      finishedGames: 0,
      challenges: [],
      operatingSystems: new Map(),
      chrome: new Map()
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
        {this.state.challenges.length > 0 && this.state.challenges.map(
          (challenge, index) =>
            <div key={ index }>
              challenge { index + 1 } started games: { challenge[0].length }
              <br />
              challenge { index + 1 } finished games: { challenge[1].length }
            </div>
        )}
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
        <br />
        <br />
        {
          this.state.chrome.has("Chrome") &&
          `Chrome ${this.state.chrome.get("Chrome").length}`
        }
        <br />
        {
          this.state.chrome.has("Chrome 3") &&
          `Chrome 3 ${this.state.chrome.get("Chrome 3").length}`
        }
        <br />
        {
          this.state.chrome.has("Chrome 4") &&
          `Chrome 4 ${this.state.chrome.get("Chrome 4").length}`
        }
        <br />
        {
          this.state.chrome.has("Chrome 5") &&
          `Chrome 5 ${this.state.chrome.get("Chrome 5").length}`
        }
        <br />
        {
          this.state.chrome.has("Chrome 6") &&
          `Chrome 6 ${this.state.chrome.get("Chrome 6").length}`
        }
      </div>
    )
  }

  async getStats() {
    console.log(`connected as ${this.props.client.id}`)

    const days = 37
    const dayInMilliseconds = 86400000
    const now = new Date()
    const then = new Date(now - days * dayInMilliseconds)

    const range = {
      from: then.toISOString(),
      to: now.toISOString()
    }

    const startedGames = await this.emitWithRepsonse("startedGamesInRange", range)

    const finishedGames = startedGames.filter(game => game.finished)

    const challenges = []

    for (let i = 0; i < 11; i ++) {
      const challengeNumber = i + 1

      const requests = []

      requests.push(this.emitWithRepsonse("startedChallengesInRange", range, challengeNumber))
      requests.push(this.emitWithRepsonse("finishedChallengesInRange", range, challengeNumber))

      challenges[i] = await Promise.all(requests)
    }

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

    const chrome = new Map()

    chrome.set(
      "Chrome", this.filterForUserAgent(startedGames, "Chrome")
    )

    chrome.set(
      "Chrome 3", this.filterForUserAgent(startedGames, "Chrome/3")
    )

    chrome.set(
      "Chrome 4", this.filterForUserAgent(startedGames, "Chrome/4")
    )

    chrome.set(
      "Chrome 5", this.filterForUserAgent(startedGames, "Chrome/5")
    )

    chrome.set(
      "Chrome 6", this.filterForUserAgent(startedGames, "Chrome/6")
    )


    this.setState({
      startedGames,
      finishedGames,
      challenges,
      operatingSystems,
      chrome
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
      item => item.userAgent ? item.userAgent.search(new RegExp(regExp, "g")) >= 0 : false
    )
  }
}

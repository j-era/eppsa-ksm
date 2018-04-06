import puppeteer from "puppeteer"

const GAME_URL = "https://game.marco.eppsa.de"
const clientCount = 10

for (let i = 0; i < clientCount; i++) {
  ghostClient(i).catch(error => console.error(error))
}

async function ghostClient(i) {
  const config = {
    headless: true,
    slowMo: 100 + Math.random() * 900
  }

  puppeteer.launch(config).then(async browser => {
    try {
      const page = await browser.newPage()

      await page.deleteCookie({ name: "gameId", url: GAME_URL })

      await page.goto(GAME_URL)

      await page.type("input", `Bobo ${i}`)

      const startNewGame = await page.$(".startNewGame")
      if (startNewGame) {await startNewGame.click()}

      for (let i = 0; i < 11; i++) {
        const startChallenge = await page.$(".startChallenge")
        if (startChallenge) {await startChallenge.click()}

        const challengeFrame = page.frames()[1]

        const button = await challengeFrame.$(".button")
        if (button) {await button.click()}
      }

      await browser.close()
    } catch (error) {
      console.error(error)
    }
  }).then(() => {
    ghostClient(i).catch(error => console.error(error))
  }).catch(error => console.error(error))
}

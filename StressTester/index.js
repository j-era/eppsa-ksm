const puppeteer = require("puppeteer")

const GAME_URL = "https://game.marco.eppsa.de"
const clientCount = 30

const jitterTime = 1000 * 5

const config = {
  headless: true,
  slowMo: 1000
}

puppeteer.launch(config).then(browser => {
  for (let i = 0; i < clientCount; i++) {
    ghostClient(browser, i).catch(error => console.error(error))
  }
}).catch(error => console.error(error))


async function ghostClient(browser, i) {
  const page = await browser.newPage()

  try {
    await page.deleteCookie({ name: "gameId", url: GAME_URL })

    await page.goto(GAME_URL)

    await page.waitFor("input")

    await page.type("input", `Bobo ${i}`, { deplay: 0 })

    await page.click(".startNewGame")

    for (let j = 0; j < 11; j++) {
      console.log(`Client ${i} started Challenge ${j}`)

      await page.waitFor(".startChallenge")

      await page.click(".startChallenge")

      const challengeFrame = page.frames()[1]

      await challengeFrame.waitFor(".button")

      await challengeFrame.click(".button")

      await timeout(jitterTime * Math.random())
    }

    await page.close()

    ghostClient(browser, i).catch(error => console.error(error))
  } catch (error) {
    console.error(error)
    await page.close()
    ghostClient(browser, i).catch(error => console.error(error))
  }
}


function timeout(ms) { return new Promise(res => setTimeout(res, ms))}

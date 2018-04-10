const puppeteer = require("puppeteer")

const GAME_URL = `https://${process.env.GAME_URL}`
const clientCount = Number(process.env.MAX_CLIENTS || 1)

const config = {
  headless: true,
  slowMo: 400
}

puppeteer.launch(config).then(browser => {
  for (let i = 0; i < clientCount; i++) {
    ghostClient(browser, i)
  }
}).catch(error => console.error(error))


async function ghostClient(browser, i) {
  const page = await browser.newPage()

  try {
    await page.deleteCookie({ name: "gameId", url: GAME_URL })

    await page.goto(GAME_URL)

    await page.waitFor("input")

    await page.type("input", `BotPlayer ${i}`, { deplay: 0 })

    await page.click(".startNewGame")

    for (let j = 0; j < 11; j++) {
      console.log(`Client ${i} started Challenge ${j}`)

      await page.waitFor(".startChallenge")

      await page.click(".startChallenge")

      const challengeFrame = page.frames()[1]

      await challengeFrame.waitForSelector("HTML")

      const mainFrameContext = await page.frames()[0].executionContext()

      const mainFrameWindow = await mainFrameContext.evaluateHandle(() => window)

      await mainFrameContext.evaluate(
        window => window.postMessage({ source: "challenge", score: 1 }, "*"),
        mainFrameWindow
      )
    }

    await page.close()

    ghostClient(browser, i).catch(error => console.error(error))
  } catch (error) {
    console.error(`Client ${i} had an ${error}`)
    await page.close()
    ghostClient(browser, i).catch(error => console.error(error))
  }
}

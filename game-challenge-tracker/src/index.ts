import micro, { json } from "micro"
import { promises as fsPromises } from "fs"

import { IncomingMessage } from "http"

const { appendFile } = fsPromises

type ChallengeCompletion = {
  gameID: string
  challengeNumber: number
  score: number
  finished: boolean
  time: string
}

async function handleRequest(request: IncomingMessage) {
  const challengeCompletion = await json(request) as ChallengeCompletion

  if (challengeCompletion) {
    challengeCompletion.time = new Date().toLocaleString()
    await appendFile("./logs/log.txt", `${JSON.stringify(challengeCompletion)}\n`)
  }
  return ""
}

micro(handleRequest).listen(80)

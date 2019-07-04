import micro, { json } from "micro"
import { promises as fsPromises } from "fs"

import { IncomingMessage } from "http"

const { appendFile } = fsPromises

type ChallengeCompletion = {
  gameId: string
  challengeNumber: number
  score: number
  finished: boolean
  time: string
}

async function handleRequest(request: IncomingMessage) {
  if (request.method === "POST") {
    const challengeCompletion = await json(request) as ChallengeCompletion

    if (isValid(challengeCompletion)) {
      challengeCompletion.time = new Date().toLocaleString()
      await appendFile("./logs/log.txt", `${JSON.stringify(challengeCompletion)}\n`)
      return ""
    }
  }
}

function isValid({ gameId, challengeNumber, score, finished }: ChallengeCompletion) {
  return (
    typeof gameId === "string" &&
    typeof challengeNumber === "number" &&
    typeof score === "number" &&
    typeof finished === "boolean"
  )
}

micro(handleRequest).listen(80)

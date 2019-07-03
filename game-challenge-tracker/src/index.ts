import micro, { json } from "micro"
import { promises as fsPromises } from "fs"

import { IncomingMessage } from "http"

const { appendFile } = fsPromises

async function handleRequest(request: IncomingMessage) {
  const challengeCompletion = await json(request)
  await appendFile("./logs/log.txt", `${JSON.stringify(challengeCompletion)}\n`)
  return ""
}

micro(handleRequest).listen(80)

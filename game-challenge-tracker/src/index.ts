import micro, { text } from "micro"
import { promises as fsPromises } from "fs"
const { appendFile } = fsPromises

import { IncomingMessage } from "http"

async function handleRequest(request: IncomingMessage) {
  const challengeCompletion = await text(request)
  await appendFile("./logs/log.txt", `${challengeCompletion}\n`)
  return ""
}

appendFile("./logs/log.txt", `test\n`)

micro(handleRequest).listen(3000)

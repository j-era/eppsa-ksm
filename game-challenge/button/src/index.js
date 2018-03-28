import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

let gameClient
let config

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
  config = event.data
}

const completeChallenge = () => {
  gameClient.source.postMessage(
    {
      source: "challenge",
      score: config.challenge.reward
    }, gameClient.origin)
}

ReactDOM.render(<App
  onClick={ completeChallenge }
/>, document.getElementById('root'))

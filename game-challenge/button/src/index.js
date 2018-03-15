import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

let gameSource = null
let gameOrigin = null

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event)
{
  console.log(event)
  gameSource = event.source
  gameOrigin = event.origin
}

const completeChallenge = () => {
  console.log("Sending Complete")
  gameSource.postMessage("Complete!", gameOrigin)
}

ReactDOM.render(<App
  onClick={ completeChallenge }
/>, document.getElementById('root'));

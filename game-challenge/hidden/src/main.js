//import Boot from "./Boot.js";
import GameScene from "./gameScene.js";
import Win from "./Win.js";
//import Lose from "./Lose.js";

let gameClient

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
}


var config = {
	type: Phaser.AUTO,
	parent: 'gameHere',
	width: window.innerWidth,
	height: window.innerHeight,

	scene: [
		GameScene,
		Win,
	]
};

var game = new Phaser.Game(config);

game.completeChallenge = (score) => {
	setTimeout(() => {
	  gameClient.source.postMessage(
	    {
	      source: "challenge",
	      score
	    }, gameClient.origin)
	}, 1000)
}
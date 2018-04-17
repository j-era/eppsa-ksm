//import Boot from "./Boot.js";
import GameScene from "./gameScene.js";
import Win from "./Win.js";
//import Lose from "./Lose.js";

var gameClient;
var gameData;

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event.data)
  gameData = event.data;
  gameClient = { source: event.source, origin: event.origin }

  init();
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

var init = function(){
	var game = new Phaser.Game(config);

	console.log(gameData);

	game.gameData = gameData;

	game.completeChallenge = (score) => {
		setTimeout(() => {
		  gameClient.source.postMessage(
		    {
		      source: "challenge",
		      score
		    }, gameClient.origin)
		}, 1000)
	}
}




import Boot from "./Boot.js";
import GameScene from "./GameScene.js";
import Win from "./Win.js";
import Lose from "./Lose.js";

let gameClient

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
}

const completeChallenge = () => {
  gameClient.source.postMessage(
    {
      source: "challenge",
      score: 400
    }, gameClient.origin)
}

var config = {
	type: Phaser.AUTO,
	parent: 'content',
	width: window.innerWidth * window.devicePixelRatio,
	height: window.innerHeight * window.devicePixelRatio,

	scene: [
		Boot,
		GameScene,
		Win,
		Lose
	]
};

var game = new Phaser.Game(config);

game.completeChallenge = () => {
	setTimeout(() => {
	  gameClient.source.postMessage(
	    {
	      source: "challenge",
	      score: 400
	    }, gameClient.origin)
	}, 1000)
}

function firstStatePreload (){

}


function firstStateCreate () {

}

function firstStateUpdate (){

}

function checkTap (){
	pic2.y -= 5;
	console.log("WupWup");
}

function SecondStateCreate () {
	//text =
}

import boot from "./boot.js";
import gameScene from "./gameScene.js";
import win from "./win.js";
import lose from "./lose.js";

let gameClient

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
}

var config = {
	type: Phaser.AUTO,
	parent: 'content',
	width: window.innerWidth * window.devicePixelRatio,
	height: window.innerHeight * window.devicePixelRatio,

	scene: [
		boot,
		gameScene,
		win,
		lose
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

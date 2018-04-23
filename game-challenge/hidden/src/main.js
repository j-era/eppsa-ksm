import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"
import Boot from "./boot.js";
import GameScene from "./gameScene.js";
import Win from "./Win.js";
import Phaser from "./phaser";

let gameData;
let gameCallbacks;

bootstrap((data, callbacks) => {
	//console.log(data, callbacks);
	gameData = data.challenge;
	gameCallbacks = callbacks.callbacks;
	init();
  })


var config = {
	type: Phaser.AUTO,
	parent: 'gameHere',
	width: window.innerWidth,
	height: window.innerHeight,

	scene: [
	Boot,
	GameScene,
	Win,
	]
};

var init = function(){
	var game = new Phaser.Game(config);

	game.gameData = gameData;

	game.completeChallenge = (score) => {
		setTimeout(() => {
			gameCallbacks.finishChallenge(score);
		}, 1000)
	}
}




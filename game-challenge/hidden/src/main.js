import { bootstrap } from "eppsa-ksm-shared"
import Boot from "./boot.js";
import GameScene from "./gameScene.js";
import Win from "./Win.js";
import Phaser from "./phaser.min";

let gameData;
let gameCallbacks;
let shared;

bootstrap((data, callbacks) => {
	//console.log(data, callbacks);
	gameData = data.challenge;
	gameCallbacks = callbacks.callbacks;
	shared = data.shared;
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
	game.gameCallbacks = gameCallbacks;
	game.shared = shared;

	game.completeChallenge = (score) => {
		setTimeout(() => {
			gameCallbacks.finishChallenge(score);
		}, 1000)
	}
}




import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"
import Boot from "./boot.js";
import GameScene from "./gameScene.js";
import Win from "./Win.js";
import Phaser from "./phaser.min";

let gameData;
let gameCallbacks;
let shared;
let color;

bootstrap((data, callbacks) => {
	//console.log(data, callbacks);
	gameData = data.challenge;
	gameCallbacks = callbacks.callbacks;
	shared = data.shared;
	color = data.color;
	init();
  })


var config = {
	type: Phaser.AUTO,
	parent: 'gameHere',
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: "#ffffff",

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
	game.color = color;

	game.completeChallenge = (score) => {
		setTimeout(() => {
			gameCallbacks.finishChallenge(score);
		}, 1000)
	}
}

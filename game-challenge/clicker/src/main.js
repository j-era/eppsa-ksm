import { bootstrap } from "eppsa-ksm-shared"

import boot from "./boot.js";
import gameScene from "./gameScene.js";
import win from "./win.js";
import lose from "./lose.js";
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

var init = function(){
	var game = new Phaser.Game(config);

	//console.log(gameData);

	game.gameData = gameData;
	game.gameCallbacks = gameCallbacks;
	game.shared = shared;

	game.completeChallenge = (score) => {
		setTimeout(() => {
			gameCallbacks.finishChallenge(score);
		}, 1000)
	}
}

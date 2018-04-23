import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"
import boot from "./boot.js";
import gameScene from "./gameScene.js";
import win from "./win.js";
import lose from "./lose.js";
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

	game.completeChallenge = (score) => {
		setTimeout(() => {
		  gameClient.source.postMessage(
		    {
		      source: "challenge",
					score,
					id: "finish"
		    }, gameClient.origin)
		}, 1000)
	}
}

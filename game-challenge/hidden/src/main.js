//import Boot from "./Boot.js";
import GameScene from "./gameScene.js";
import Win from "./Win.js";
//import Lose from "./Lose.js";

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

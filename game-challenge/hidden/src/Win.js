import Phaser from "./phaser";

class Win extends Phaser.Scene {
	constructor () {
		super({
			key: 'WinScene'
		});
	}

	preload () {

	}

	create (data) {

		console.log("Win");
		var x = window.innerWidth/2-(window.innerWidth/2*0.4);
		var y = window.innerHeight/2;

		var fontSize = Math.floor(window.innerHeight*window.innerWidth/x/y)*5;

		var text1 = this.add.text(x, y, 'You earn ' + data.t + ' point(s)', { font: fontSize + 'px Arial', fill: 'green'});

		this.points = data.t * this.sys.game.gameData.rewardValue * this.sys.game.shared.config.hiddenFactor;

		this.sys.game.completeChallenge(this.points);
	}
}

export default Win;

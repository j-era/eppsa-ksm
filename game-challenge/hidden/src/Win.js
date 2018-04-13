class Win extends Phaser.Scene {
	constructor () {
		super({
			key: 'WinScene'
		});
	}

	preload () {

	}

	create () {
		var x = window.innerWidth/2-(window.innerWidth/2*0.4);
		var y = window.innerHeight/2;

		var fontSize = Math.floor(window.innerHeight*window.innerWidth/x/y)*5;

		var text1 = this.add.text(x, y, 'You win^^', { font: fontSize + 'px Arial', fill: 'green'});

		this.sys.game.completeChallenge(400)
	}
}

export default Win;

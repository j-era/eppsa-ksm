class Lose extends Phaser.Scene {
	constructor () {
		super({
			key: 'LoseScene'
		});
	}

	preload () {

	}

	create () {
		console.log("I am the LoseScene!");
		var x = window.innerWidth/2-(window.innerWidth/2*0.4);
		var y = window.innerHeight/2;
		var fontSize = Math.floor(window.innerHeight*window.innerWidth/x/y)*5;
		//console.log(Math.floor(window.innerHeight*window.innerWidth/x/y)*5);
		var text2 = this.add.text(x, y, 'You Lose:/', { font: fontSize + 'px Arial', fill: 'red'});

		this.sys.game.completeChallenge(0)

	}
}

export default Lose;

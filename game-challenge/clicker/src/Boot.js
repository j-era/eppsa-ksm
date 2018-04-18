class Boot extends Phaser.Scene {
	constructor () {
		super({key: 'BootScene'})
	}

	preload () {

	}

	create () {

		var timedEvent = this.time.addEvent({
			delay: 5000,
			callback: this.start,
			callbackScope: this
		});
		
	}

	start() {
		this.scene.start('GameScene');
		console.log("I am the BootScene!");
	}
}

export default Boot;
class Boot extends Phaser.Scene {
	constructor () {
		super({key: 'BootScene'})
	}

	preload () {

	}

	create () {
		this.scene.start('GameScene')
		console.log("I am the BootScene!");
	}
}

export default Boot;
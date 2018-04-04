class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene',

		});
	}

	preload() {
		this.load.image('water', 'img/Water.jpg');
		this.load.image('boat', 'img/Boat.jpg');
		this.load.image('boat2', 'img/Boat2.jpg');
		this.load.image('Ziel', 'img/Ziellinie.jpg');
	}

	create() {

		var waterPic = this.add.image(0, 0, 'water').setOrigin(0, 0).setInteractive();

		var TempZiel = this.textures.get('Ziel');
		var ZielScale = window.innerHeight / TempZiel.source[0].height *0.04;
		var Ziel = this.add.image(0, window.innerHeight-(window.innerHeight*0.85), 'Ziel').setOrigin(0,0);
		Ziel.setScale(window.innerWidth/Ziel.width, ZielScale);


		waterPic.setScale(window.innerWidth/waterPic.width, window.innerHeight/waterPic.height);
		waterPic.inputEnabled = true;


		var tempImg = this.textures.get('boat');
		var boatPicScaleWidthBy = window.innerWidth / tempImg.source[0].width * 0.1;
		var boatPicScaleHeightBy = window.innerHeight / tempImg.source[0].height * 0.1;

		this.anims.create( {
			key: 'boatAnim',
			frames: [
			{key: 'boat'},
			{key: 'boat2', duration: 100}
			],
			frameRate: 8,
			repeat: -1
		});
		this.boatPic = this.add.sprite(window.innerWidth - window.innerWidth*0.25, window.innerHeight - tempImg.source[0].width * boatPicScaleHeightBy, 'boat').play('boatAnim');
		this.boatPic.setScale(boatPicScaleWidthBy, boatPicScaleHeightBy);

		var timedEvent = this.time.addEvent({
			delay: 13000,
			callback: this.gameLose,
			callbackScope: this
		});

		var bla = this;
		waterPic.on('pointerup', function(pointer){
			bla.boatPic.y -= window.innerHeight/10;
			if(bla.boatPic.y < window.innerHeight-(window.innerHeight*0.85)){
				timedEvent.paused = true;
				var Timeleft = timedEvent.getProgress().toString().substr(0,4) * 10;
				Timeleft = Timeleft.toFixed(1);
				bla.gameWin(Timeleft);
			}

		})

	}

	update() {

	}

	gameWin(Timeleft){
		this.scene.start('WinScene', { t: Timeleft});
	}

	gameLose(){
		this.scene.start('LoseScene');
	}

}

export default GameScene;

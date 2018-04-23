import Phaser from "./phaser";

class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene',

		});
	}

	preload() {

		var scope = this;
		for(var key in this.sys.game.gameData.assets){
			if(key == "template"){
				continue;
			}
			this.load.image(scope.sys.game.gameData.assets[key].name, process.env.ASSET_SERVER_URI + "/" + scope.sys.game.gameData.assets[key].image.src);
			console.log(key)
		}
	}

	create() {


		this.anims.create( {
			key: 'waterAnim',
			frames: [
			{key: 'water'},
			{key: 'water2', duration: 100}
			],
			frameRate: 8,
			repeat: -1,
		});


		var back = this.add.image(0, 0, 'background').setOrigin(0, 0).setInteractive();
		back.setScale(window.innerWidth/back.displayWidth, (window.innerHeight/3)/back.displayHeight)
		var waterPic = this.add.sprite(0, back.displayHeight, 'water').play('waterAnim').setOrigin(0, 0).setInteractive();

		var TempZiel = this.textures.get('Ziellinie');
		var ZielScale = window.innerHeight / TempZiel.source[0].height *0.04;
		var Ziel = this.add.image(window.innerWidth - (window.innerWidth*0.15), window.innerHeight-(window.innerHeight*1), 'Ziellinie').setOrigin(0,0);

		Ziel.setScale(ZielScale,window.innerWidth/(Ziel.width/2));


		waterPic.setScale(window.innerWidth/waterPic.displayWidth, window.innerHeight/waterPic.displayHeight);
		waterPic.inputEnabled = true;


		var tempImg = this.textures.get('boat');
		var boatPicScaleWidthBy = window.innerWidth / tempImg.source[0].width * 0.1;
		var boatPicScaleHeightBy = window.innerHeight / tempImg.source[0].height * 0.1;

		this.anims.create( {
			key: 'boatAnim',
			frames: [
			{key: 'boat'},
			{key: 'boat2'},
			{key: 'boat3', duration: 100}
			],
			frameRate: 9,
			repeat: -1,
		});

		//this.boatPic = this.add.sprite(window.innerWidth - window.innerWidth*0.85, window.innerHeight - (tempImg.source[0].width * boatPicScaleHeightBy * 5), 'boat').play('boatAnim');
		this.boatPic = this.add.sprite(this.sys.game.gameData.StartPointX, this.sys.game.gameData.StartPointY , 'boat').play('boatAnim').setOrigin(0,0).setDepth(5).setScale(5,5);

		this.boatPic.setScale(boatPicScaleWidthBy, boatPicScaleHeightBy);

		this.sys.game.gameCallbacks.showTimeline(this.sys.game.gameData.timer);
		this.sys.game.gameCallbacks.startTimelineClock();
		var timedEvent = this.time.addEvent({
			delay: this.sys.game.gameData.timer * 1000,
			callback: this.gameLose,
			callbackScope: this
		});

		var scope = this;
		waterPic.on('pointerup', function(pointer){
			scope.boatPic.x = parseInt(scope.boatPic.x);
			scope.boatPic.x += scope.sys.game.gameData.MovementX;
			//if(bla.boatPic.x > window.innerHeight-(window.innerHeight*0.35)){
				if(scope.boatPic.x > scope.sys.game.gameData.EndPointX){
					timedEvent.paused = true;
					var Timeleft = timedEvent.getProgress().toString().substr(0,4) * 10;
					Timeleft = Timeleft.toFixed(1);
					scope.gameWin(Timeleft);
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

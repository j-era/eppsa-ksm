import Phaser from "./phaser.min";
import {ScoreCalculation} from "eppsa-ksm-shared";

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
		this.countdownTimer;
		this.countdownText;
		this.currentCountdownValue = 3;
		this.gameStarted = false;

		var back = this.add.image(0, 0, 'background').setOrigin(0, 0).setInteractive();
		let backHeight = 1;
		if(this.sys.game.gameData.ScaleOfBackground != undefined){
			backHeight = this.sys.game.gameData.ScaleOfBackground;
		}
		back.setScale(window.innerWidth/back.displayWidth, (window.innerHeight/backHeight)/back.displayHeight)

		if(this.sys.game.gameData.showWater == "true"){
			this.anims.create( {
				key: 'waterAnim',
				frames: [
				{key: 'water'},
				{key: 'water2'},
				{key: 'water3'},
				{key: 'water4'},
				{key: 'water5', duration: 50}
				],
				frameRate: 8,
				repeat: -1,
			});

			var waterPic = this.add.sprite(0, back.displayHeight, 'water').play('waterAnim').setOrigin(0, 0).setInteractive();
			waterPic.setScale(window.innerWidth/waterPic.displayWidth, window.innerHeight/waterPic.displayHeight);
			waterPic.inputEnabled = true;

			waterPic.on('pointerup', function(pointer){
				if(scope.gameStarted){
					scope.boatPic.x = parseInt(scope.boatPic.x);
					scope.boatPic.x += scope.xPosToScreen(scope.sys.game.gameData.MovementX);
					//if(bla.boatPic.x > window.innerHeight-(window.innerHeight*0.35)){
					if(scope.boatPic.x > scope.xPosToScreen(scope.sys.game.gameData.EndPointX)){
						scope.timedEvent.paused = true;
						var Timeleft = scope.timedEvent.getProgress().toString().substr(0,4) * 10;
						Timeleft = Timeleft.toFixed(1);
						scope.gameWin(Timeleft);
					}
				}
		
			})
		}
		
		back.on('pointerup', function(pointer){
			if(scope.gameStarted){
				scope.boatPic.x = parseInt(scope.boatPic.x);
				scope.boatPic.x += scope.xPosToScreen(scope.sys.game.gameData.MovementX);
				//if(bla.boatPic.x > window.innerHeight-(window.innerHeight*0.35)){
				if(scope.boatPic.x > scope.xPosToScreen(scope.sys.game.gameData.EndPointX)){
					scope.timedEvent.paused = true;
					var Timeleft = scope.timedEvent.getProgress().toString().substr(0,4) * 10;
					Timeleft = Timeleft.toFixed(1);
					scope.gameWin(Timeleft);
				}
			}
	
		})

		var TempZiel = this.textures.get('Ziellinie');
		var ZielScale = window.innerWidth / TempZiel.source[0].width *0.40;
		var Ziel = this.add.image(window.innerWidth - (window.innerWidth*0.15), window.innerHeight/backHeight, 'Ziellinie').setOrigin(0,0);
		if(this.sys.game.gameData.showFinishLine != "true"){
			Ziel.setAlpha(0);
		}

		Ziel.setScale(ZielScale,(window.innerHeight/backHeight)/Ziel.height);

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

		var tempImg = this.textures.get('boat');
		var boatPicScaleWidthBy = window.innerWidth / tempImg.source[0].width * 0.5;

		//this.boatPic = this.add.sprite(window.innerWidth - window.innerWidth*0.85, window.innerHeight - (tempImg.source[0].width * boatPicScaleHeightBy * 5), 'boat').play('boatAnim');
		this.boatPic = this.add.sprite(this.xPosToScreen(this.sys.game.gameData.StartPointX), this.xPosToScreen(this.sys.game.gameData.StartPointY) , 'boat').play('boatAnim').setOrigin(0,0).setDepth(5);

		this.boatPic.setScale(boatPicScaleWidthBy);

		let lineColor = this.sys.game.color.replace("#", "0x");
		var line = new Phaser.Geom.Line(-20, window.innerHeight/2 + window.innerHeight/20, window.innerWidth + 20, window.innerHeight/2 - window.innerHeight/20);
		var circle = new Phaser.Geom.Circle(window.innerWidth/2, window.innerHeight/2, window.innerHeight/6);
		this.CountdownGraphics = this.add.graphics({ lineStyle: { width: window.innerHeight/6, color: lineColor }, fillStyle: { color: lineColor } });
		
		this.CountdownGraphics.strokeLineShape(line);
		this.CountdownGraphics.fillCircleShape(circle);
		this.CountdownGraphics.setDepth(10);

		let countdownTextSize = window.innerHeight/5;
		this.countdownText = this.add.text(window.innerWidth/2, window.innerHeight/2, "3", {font: countdownTextSize + 'px Arial', fill: '#ffffff'}).setDepth(10).setOrigin(0.5);
		this.countdownTimer = this.time.addEvent({delay: 1000, callback: this.countdownFunc, callbackScope: this, repeat: 3});

		var scope = this;
		
			
	}

	xPosToScreen(pos){
		return window.innerWidth * pos/100
	}
	
	yPosToScreen(pos){
		return window.innerHeight * pos/100;
	}
	
	moveImage(){
		let scope = this;
		if(scope.gameStarted){
			scope.boatPic.x = parseInt(scope.boatPic.x);
			scope.boatPic.x += scope.sys.game.gameData.MovementX;
			//if(bla.boatPic.x > window.innerHeight-(window.innerHeight*0.35)){
			if(scope.boatPic.x > scope.sys.game.gameData.EndPointX){
				scope.timedEvent.paused = true;
				var Timeleft = scope.timedEvent.getProgress().toString().substr(0,4) * 10;
				Timeleft = Timeleft.toFixed(1);
				scope.gameWin(Timeleft);
			}
		}
	}

	countdownFunc(){
		console.log(this.currentCountdownValue);
		if(this.currentCountdownValue >= 1){
			this.currentCountdownValue --;
			this.countdownText.setText(this.currentCountdownValue);
		}
		else{
			this.CountdownGraphics.destroy();
			this.countdownText.destroy();
			this.sys.game.gameCallbacks.showTimeline(this.sys.game.gameData.timer);
			this.sys.game.gameCallbacks.startTimelineClock();
			this.timedEvent = this.time.addEvent({
				delay: this.sys.game.gameData.timer * 1000,
				callback: this.gameLose,
				callbackScope: this
			});
			this.gameStarted = true;
		}
	}

	update() {

	}

	gameWin(Timeleft){
		//this.scene.start('WinScene', { t: Timeleft});
		const scoreCalc = new ScoreCalculation(
			Timeleft,
			{ ...this.sys.game.gameData.score, gameFactor: this.sys.game.shared.config.clickerScoreFactor }
		  )
		  this.points = scoreCalc.getScore();

		this.sys.game.completeChallenge(this.points.score + this.points.bonus);
	}

	gameLose(){
		//this.scene.start('LoseScene');
		this.sys.game.completeChallenge(0);
	}

}

export default GameScene;

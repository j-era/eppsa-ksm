import Phaser from "./phaser.min";
import ScoreCalculation from "../node_modules/eppsa-ksm-shared/functions/scoreCalculation"

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
						scope.gameStarted = false;
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
				scope.tweens.add( {
					targets: scope.boatPic,
					scaleX: scope.boatPic.scaleX * 1.04,
					scaleY: scope.boatPic.scaleY * 1.04,
					ease: 'Linear',
					duration: 50,
					repeat: 0,
					yoyo: true,
				});

				//if(bla.boatPic.x > window.innerHeight-(window.innerHeight*0.35)){
				if(scope.boatPic.x > scope.xPosToScreen(scope.sys.game.gameData.EndPointX)){
					scope.gameStarted = false;
					scope.timedEvent.paused = true;
					var Timeleft = scope.timedEvent.getProgress().toString().substr(0,4) * 10;
					Timeleft = Timeleft.toFixed(1);
					scope.gameWin(Timeleft);
				}
			}
	
		})

		var TempZiel = this.textures.get('Ziellinie');
		var Ziel = this.add.image(this.xPosToScreen(this.sys.game.gameData.finishLineX), this.yPosToScreen(this.sys.game.gameData.finishLineY), 'Ziellinie').setOrigin(0,0).setDepth(3);
		if(this.sys.game.gameData.showFinishLine != "true"){
			Ziel.setAlpha(0);
		}

		Ziel.setScale(window.innerWidth/Ziel.width * this.sys.game.gameData.finishLineWidth,window.innerHeight/Ziel.height * this.sys.game.gameData.finishLineHeight);

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
			console.log("clicker game started, startTimeline called");
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
		this.sys.game.gameCallbacks.stopTimelineClock();
		console.log("clicker game ended, stopTimeline called");
		let scope = this;
		let startY = this.boatPic.y;

		this.tweens.add( {
			targets: scope.boatPic,
			y: startY + 10,
			ease: 'Linear',
			duration: 250,
			repeat: -1,
			yoyo: true,
			onYoyo: function(){
				//scope.boatPic.angle = 0;
			},
			onComplete: function() {
				//scope.boatPic.angle = 0;
			}
		})

    	const scoreCalc = new ScoreCalculation(
			Timeleft,
			{
				reward: this.sys.game.gameData.score.reward,
				tier1TimeBonus: this.sys.game.gameData.score.tier1TimeBonus,
				tier2TimeBonus: this.sys.game.gameData.score.tier2TimeBonus,
				tier3TimeBonus: this.sys.game.gameData.score.tier3TimeBonus,
				sessionLength: this.sys.game.gameData.score.sessionLength,
				gameFactor: this.sys.game.shared.config.clickerScoreFactor
			})
		this.points = scoreCalc.getScore();
		let lineColor = this.sys.game.color.replace("#", "0x");
		var line = new Phaser.Geom.Line(-20, window.innerHeight/2 + window.innerHeight/20, window.innerWidth + 20, window.innerHeight/2 - window.innerHeight/20);
		var circle = new Phaser.Geom.Circle(window.innerWidth/2, window.innerHeight/2, window.innerHeight/6);
		this.CountdownGraphics = this.add.graphics({ lineStyle: { width: window.innerHeight/6, color: lineColor }, fillStyle: { color: lineColor } });
			
		this.CountdownGraphics.strokeLineShape(line);
		this.CountdownGraphics.fillCircleShape(circle);
		this.CountdownGraphics.setDepth(10);

		let countdownTextSize = window.innerHeight/10;
		let finalScore = this.points.score + this.points.bonus;
		this.countdownText = this.add.text(window.innerWidth/2, window.innerHeight/2, "+ " + finalScore, {font: countdownTextSize + 'px Arial', fill: '#ffffff'}).setDepth(10).setOrigin(0.5);


		setTimeout(function(){
			console.log("clicker game called complete Challenge");
			scope.sys.game.completeChallenge(scope.points.score + scope.points.bonus);
		}, 1000);

	}

	gameLose(){
		this.sys.game.gameCallbacks.stopTimelineClock();
		let scope = this;
		let lineColor = this.sys.game.color.replace("#", "0x");
		var line = new Phaser.Geom.Line(-20, window.innerHeight/2 + window.innerHeight/20, window.innerWidth + 20, window.innerHeight/2 - window.innerHeight/20);
		var circle = new Phaser.Geom.Circle(window.innerWidth/2, window.innerHeight/2, window.innerHeight/6);
		this.CountdownGraphics = this.add.graphics({ lineStyle: { width: window.innerHeight/6, color: lineColor }, fillStyle: { color: lineColor } });
			
		this.CountdownGraphics.strokeLineShape(line);
		this.CountdownGraphics.fillCircleShape(circle);
		this.CountdownGraphics.setDepth(10);

		let countdownTextSize = window.innerHeight/10;
		this.countdownText = this.add.text(window.innerWidth/2, window.innerHeight/2, "GAME OVER", {font: countdownTextSize + 'px Arial', fill: '#ffffff'}).setDepth(10).setOrigin(0.5);


		setTimeout(function(){
			scope.sys.game.completeChallenge(0);
		}, 1000);

		//this.sys.game.completeChallenge(0);
	}

}

export default GameScene;

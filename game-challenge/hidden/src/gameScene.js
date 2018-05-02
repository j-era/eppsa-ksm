import Phaser from "./phaser.min";

class gameScene extends Phaser.Scene {
	constructor () {
		super({
			key: 'gameScene',
		});
	}

	preload() {
		var scope = this;
		for(var key in this.sys.game.gameData.assets){
			if(key == "template"){
				continue;
			}
			this.load.image(scope.sys.game.gameData.assets[key].name, process.env.ASSET_SERVER_URI + "/" + scope.sys.game.gameData.assets[key].image.src);
		}
	}

	create(data) {
		this.row1 = [];
		this.row2 = [];
		this.row3 = [];
		this.row4 = [];
		this.row5 = [];
		this.row6 = [];
		this.row7 = [];
		this.moveLeft = [];
		this.moveRight = [];

		this.waitrow1 = [];
		this.waitrow2 = [];
		this.waitrow3 = [];
		this.waitrow4 = [];
		this.waitrow5 = [];
		this.waitrow6 = [];
		this.waitrow7 = [];
		this.correct = 0;

		this.imageArray = {};
		this.blockImages = {};

		this.speed1 = this.sys.game.gameData.SpeedRow1;
		this.speed2 = this.sys.game.gameData.SpeedRow2;
		this.speed3 = this.sys.game.gameData.SpeedRow3;
		this.speed4 = this.sys.game.gameData.SpeedRow4;
		this.speed5 = this.sys.game.gameData.SpeedRow5;
		this.speed6 = this.sys.game.gameData.SpeedRow6;
		this.speed7 = this.sys.game.gameData.SpeedRow7;
	//this.questions = [];

	let background = this.add.image(0, 0, 'background').setOrigin(0,0).setDepth(-2);
	background.setScale(window.innerWidth / background.width, window.innerHeight / background.height);

	for(var key in this.sys.game.gameData.pictures){
		if(key == "template"){
			continue;
		}
		if(this.sys.game.gameData.pictures[key].type == 1){
			if(this.sys.game.gameData.pictures[key].rows != undefined && this.sys.game.gameData.pictures[key].rows != ""){
				let depthArray = JSON.parse(this.sys.game.gameData.pictures[key].rows);
				console.log(depthArray);
				if(depthArray.length > 1){
					for(let i = 0; i < depthArray.length; i++){
						//this.sys.game.gameData.pictures[key].depth = depthArray[i];
						//this.imageArray[key + i] = this.sys.game.gameData.pictures[key];
						this.imageArray[key + i] = Object.assign({}, this.sys.game.gameData.pictures[key]);
						this.imageArray[key + i].depth = depthArray[i]; 
					}
				}
				console.log(this.imageArray);
			}
			else{
				this.imageArray[key] = this.sys.game.gameData.pictures[key];
			}
			//this.imageArray[key] = this.sys.game.gameData.pictures[key];
		}else{
			this.blockImages[key] = this.sys.game.gameData.pictures[key];
			if(this.blockImages[key].direction != ""){
				var temp = 'row' + this.blockImages[key].depth;
				this.imageArray[key] = this.sys.game.gameData.pictures[key]
			}
		}
	}

	/*for(var element in this.sys.game.gameData.questions){
		if(element == "template"){
			continue;
		}else{
			this.questions.push(this.sys.game.gameData.questions[element]);
		}
	}*/

	/*this.blockMaxWidth = window.innerWidth/3;
	this.blockMaxHeight = this.picMaxWidth*0.75;
	this.blockMinWidth = window.innerWidth/4;
	this.blockMinHeight = this.picMinWidth * 0.75;

	this.picMaxWidth = window.innerWidth/3;
	this.picMaxHeight = this.picMaxWidth * 0.75;
	this.picMinWidth = window.innerWidth/4;
	this.picMinHeight = this.picMinWidth * 0.75;

	this.restPicMaxWidth = window.innerWidth/3;
	this.restPicMaxHeight = this.restPMaxWidth * 0.75;
	this.restPicMinWidth = window.innerWidth/4;
	this.restPicMinHeight = this.restPicMinWidth * 0.75;*/  //Beeinflusst Scaling der Bilder - Referenz Diddi

	this.loadedImages = {};

	for(var imageKey in this.imageArray){
		var image = this.add.image(0,0, this.imageArray[imageKey].img).setOrigin(0.5,1).setInteractive().setName(imageKey);
		this.loadedImages[imageKey] = image;
	}


	for(var blockElements in this.blockImages){
		console.log(blockElements);
		if(this.blockImages[blockElements].direction == ""){
			var blocking = this.add.image(this.xPosToScreen(this.blockImages[blockElements].positionX),this.yPosToScreen(this.blockImages[blockElements].positionY), this.blockImages[blockElements].img).setOrigin(0.5,1).setName(imageKey).setInteractive();
			if(blocking.displayWidth > this.blockMaxWidth){
				var scale = (this.blockMaxWidth / blocking.displayWidth)
				blocking.setScale(scale,scale);

			}else if(blocking.displayWidth < this.blockMinWidth){
				var scale = (this.blockMinWidth / blocking.displayWidth)
				blocking.setScale(scale,scale);
			}else {
				blocking.displayWidth = blocking.displayWidth
			}

			if(blocking.displayHeight > this.blockMaxHeight){
				var scale = (this.blockMinHeight / blocking.displayHeight)
				blocking.setScale(scale,scale);
			}else if(blocking.displayHeight < this.blockMinHeight){
				var scale = (this.blockMinHeight / blocking.displayHeight)
				blocking.setScale(scale,scale);
			}else {
				blocking.displayHeight = blocking.displayHeight
			}
			blocking.setScale(window.innerWidth/blocking.width, window.innerHeight/blocking.height);


			blocking.depth = this.blockImages[blockElements].depth;
			blocking.eppsaInactive = true;
		}else{
			continue;
		}
		
	}

	

	var that = this;

	for(var element in this.imageArray){
		this.scale;
		//if(that.imageArray[element].type == 1){
			console.log(that.imageArray[element].depth);
			var scalingNumber = that.sys.game.gameData["ScalingImages" + that.imageArray[element].depth];
			this.scale = parseFloat(scalingNumber);
			console.log(parseFloat(scalingNumber));
			that.loadedImages[element].setScale(this.scale);

			//that.loadedImages[element].displayHeight = that.picMaxHeight * (that.imageArray[element].depth/2);
		//}else{
		//}
		var temp = 'row' + that.imageArray[element].depth;
		that[temp].push(that.loadedImages[element]);
		this['wait' + temp].push(element);	
	}

	this.syst = this.sys.game.gameData;

	var SpawnTimerRow1 = this.time.addEvent( {
		delay: 0,
		callback:this.spawn,
		args: [this.waitrow1, this.syst.Row1Max, this.syst.Row1Min],
		callbackScope: this,
	});
	var SpawnTimerRow2 = this.time.addEvent( {
		delay: 0,
		callback:this.spawn,
		args: [this.waitrow2, this.syst.Row2Max, this.syst.Row2Min],
		callbackScope: this,
	});		 
	var SpawnTimerRow3 = this.time.addEvent( {
		delay: 0,
		callback:this.spawn,
		args: [this.waitrow3, this.syst.Row3Max, this.syst.Row3Min],
		callbackScope: this,
	})

	var SpawnTimerRow4 = this.time.addEvent( {
		delay: 0,
		callback:this.spawn,
		args: [this.waitrow4, this.syst.Row4Max, this.syst.Row4Min],
		callbackScope: this,
	})

	var SpawnTimerRow5 = this.time.addEvent( {
		delay: 0,
		callback:this.spawn,
		args: [this.waitrow5, this.syst.Row5Max, this.syst.Row5Min],
		callbackScope: this,
	})

	var SpawnTimerRow6 = this.time.addEvent( {
		delay: 0,
		callback:this.spawn,
		args: [this.waitrow6, this.syst.Row6Max, this.syst.Row6Min],
		callbackScope: this,
	})

	var SpawnTimerRow7 = this.time.addEvent( {
		delay: 0,
		callback:this.spawn,
		args: [this.waitrow7, this.syst.Row7Max, this.syst.Row7Min],
		callbackScope: this,
	})

	this.input.on('gameobjectdown', function(pointer, gameObject){

		if(gameObject.eppsaInactive != undefined && gameObject.eppsaInactive == true){
			console.log(gameObject.name)
			return;
		}

		var count = 0;
		//this.questionTags = that.questions[that.random].tag.split(',');

		this.questionTags = data.QuestionTags
		this.testTags = that.imageArray[gameObject.name].tag.split(',');
		var scope = this;

		this.questionTags.forEach(function(tag) {
			for(var i = 0; i < scope.testTags.length; i++){
				if(tag == scope.testTags[i]){
					count += 1;
					break;
				}else{

				}
			}
		})
		if(count == this.questionTags.length){
			gameObject.input.enabled = false;
			that.correct += 1;

			that.tweens.add( {
				targets: gameObject,
				scaleX: parseFloat(that.sys.game.gameData.ClickScaleX),
				scaleY: parseFloat(that.sys.game.gameData.ClickScaleY),
				ease: 'Linear',
				duration: 500,
				repeat: 0,
				yoyo: true,
				//onComplete: function() {gameObject.input.enabled = true}
			})
		}

	});


	this.PosY = this.yPosToScreen(parseInt(this.syst.YPosRow1));
	this.row1Dif = this.yPosToScreen(parseInt(this.syst.YPosRow2));
	this.row2Dif = this.yPosToScreen(parseInt(this.syst.YPosRow3));
	this.row3Dif = this.yPosToScreen(parseInt(this.syst.YPosRow4));
	this.row4Dif = this.yPosToScreen(parseInt(this.syst.YPosRow5));
	this.row5Dif = this.yPosToScreen(parseInt(this.syst.YPosRow6));
	this.row6Dif = this.yPosToScreen(parseInt(this.syst.YPosRow7));


	for(var i = 1; i < 8; i++){
		var temp = 'row' + i;

		for(var j = 0; j < that[temp].length; j++){
			//that[temp][j].displayWidth = that.picMaxWidth * (that.imageArray[that[temp][j].name].depth / 2);
			that[temp][j].depth = that.imageArray[that[temp][j].name].depth;
			if(that.imageArray[that[temp][j].name].direction == "Left"){
				that[temp][j].x = window.innerWidth +that[temp][j].displayWidth;
				that[temp][j].flipX = !that[temp][j].flipX;
			}else{
				that[temp][j].x = 0 - that[temp][j].displayWidth;
			}
			if(this.imageArray[that[temp][j].name].positionY == ""){
				that[temp][j].y = this.PosY;
			}else{
				that[temp][j].y = this.imageArray[that[temp][j].name].positionY 
			}
		}


		var Height = 'row' + i + 'Dif';
		//console.log(Height);
		//console.log(this[Height])
		this.PosY = this[Height];
	}

	this.sys.game.gameCallbacks.showTimeline(this.sys.game.gameData.timer);
	this.sys.game.gameCallbacks.startTimelineClock();
	var timedEvent = this.time.addEvent({
		delay: this.sys.game.gameData.timer * 1000,
		callback: this.gameWin,
		callbackScope: this
	});
}
gameWin() {
	this.points = this.correct * this.sys.game.gameData.score.reward * this.sys.game.shared.config.hiddenScoreFactor;
	this.sys.game.completeChallenge(this.points);
	//this.scene.start('WinScene', { t: this.correct})
}

spawn(waitrow, max, min) {
	if(waitrow.length == 0){
		//this.spawn(waitrow,max,min)
		this.time.addEvent( {
			delay: Math.floor(Math.random() * (max - min) + min),
			callback:this.spawn,
			callbackScope: this,
			args: [waitrow, max, min]
		});
		return
	}else{
		//console.log (waitrow);
		var element = Math.floor(Math.random() * waitrow.length)
		var dirTemp = 'move' + this.imageArray[waitrow[element]].direction;
		this[dirTemp].push(this.loadedImages[waitrow[element]]);
		//console.log(this.loadedImages[waitrow[element]])
		waitrow.splice(element,1);

		this.time.addEvent( {
			delay: Math.floor(Math.random() * (max - min) + min),
			callback:this.spawn,
			callbackScope: this,
			args: [waitrow, max, min]
		});
	}
}

xPosToScreen(pos){
	console.log(pos);
	return window.innerWidth * pos/100
}

yPosToScreen(pos){
	return window.innerHeight * pos/100;
}



update(){
	for(var i = 0; i < this.moveRight.length; i++){
		var temp = 'speed' + this.moveRight[i].depth

		this.moveRight[i].x += this[temp];


		if(this.moveRight[i].x > window.innerWidth + this.moveRight[i].displayWidth){
			if(this.moveRight[i].input.enabled == false){
				this.moveRight[i].input.enabled = true
			}

			this.moveRight[i].x = 0 - this.moveRight[i].displayWidth;
			var temp = 'waitrow' + this.imageArray[this.moveRight[i].name].depth
			this[temp].push(this.moveRight[i].name);
			this.moveRight.splice(i,1);
		}
	}

	for(var i = 0; i < this.moveLeft.length; i++){
		var temp = 'speed' + this.moveLeft[i].depth

		this.moveLeft[i].x -= this[temp];

		if(this.moveLeft[i].x < (0 - this.moveLeft[i].displayWidth - this.moveLeft[i].displayWidth)){
			this.moveLeft[i].x = window.innerWidth + this.moveLeft[i].displayWidth;
			var temp = 'waitrow' + this.imageArray[this.moveLeft[i].name].depth
			this[temp].push(this.moveLeft[i].name);
			this.moveLeft.splice(i,1)
		}
	}

}

}

export default gameScene;
import Phaser from "./phaser";

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
		this.moveLeft = [];
		this.moveRight = [];

		this.waitrow1 = [];
		this.waitrow2 = [];
		this.waitrow3 = [];
		this.waitrow4 = [];
		this.correct = 0;

		this.imageArray = {};
		this.blockImages = {};
		//this.questions = [];

		for(var key in this.sys.game.gameData.pictures){
			if(key == "template"){
				continue;
			}
			if(this.sys.game.gameData.pictures[key].type == 1){
				this.imageArray[key] = this.sys.game.gameData.pictures[key];
			}else{
				this.blockImages[key] = this.sys.game.gameData.pictures[key];
				if(this.blockImages[key].direction != ""){
					var temp = 'row' + this.blockImages[key].depth;
					//this[temp].push(this.blockImages[key]);
					this.imageArray[key] = this.sys.game.gameData.pictures[key]
					//this['wait' + temp].push(key);
					//console.log("this.waitrow4", this.waitrow4);
					//console.log("this.row3", this.row3);
					//console.log("temp", temp)
					//console.log("this[temp]", this[temp])
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

		this.blockMaxWidth = window.innerWidth/3;
		this.blockMaxHeight = this.picMaxWidth*0.75;
		this.blockMinWidth = window.innerWidth/4;
		this.blockMinHeight = this.picMinWidth * 0.75;

		this.picMaxWidth = window.innerWidth/3;
		this.picMaxHeight = this.picMaxWidth*0.75;
		this.picMinWidth = window.innerWidth/4;
		this.picMinHeight = this.picMinWidth * 0.75;

		this.restPicMaxWidth = window.innerWidth/3;
		this.restPicMaxHeight = this.picMaxWidth*0.75;
		this.restPicMinWidth = window.innerWidth/4;
		this.restPicMinHeight = this.picMinWidth * 0.75;


		for(var blockElements in this.blockImages){
			console.log(this.blockImages)
			console.log(blockElements)
			if(this.blockImages[blockElements].direction == ""){
				var blocking = this.add.image(this.blockImages[blockElements].positionX,this.blockImages[blockElements].positionY, this.blockImages[blockElements].img).setOrigin(0,0).setName(imageKey).setInteractive();
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

				blocking.depth = this.blockImages[blockElements].depth;
				blocking.eppsaInactive = true;
			}else{
				continue;
			}
			
		}

		this.loadedImages = {};

		for(var imageKey in this.imageArray){
			var image = this.add.image(0,0, this.imageArray[imageKey].img).setOrigin(0,0).setInteractive().setName(imageKey);
			this.loadedImages[imageKey] = image;
		}

		//this.random = Math.floor(Math.random() * this.questions.length);

		/*this.TempTags = this.questions[this.random].tag.split(',');

		this.QuesText = this.questions[this.random].question;

		this.ques = this.add.text(window.innerWidth/2, window.innerHeight*0.9, 'Hey',{ font: window.innerHeight/35 + 'px Arial', fill: 'green'});

		this.ques.setText(this.QuesText);*/

		var that = this;



		for(var element in this.imageArray){
			//console.log(element);
			var i = 0;
			that.loadedImages[element].displayHeight = that.picMaxHeight * (that.imageArray[element].depth/2);
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
			delay: 2000,
			callback:this.spawn,
			args: [this.waitrow4, 2000, 2000],
			callbackScope: this,
		})

		this.input.on('gameobjectdown', function(pointer, gameObject){
			if(gameObject.eppsaInactive != undefined && gameObject.eppsaInactive == true){
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
					scaleX: 0.5,
					scaleY: 0.5,
					ease: 'Sine.easeOut',
					duration: 500,
					repeat: 0,
					yoyo: true,
					//onComplete: function() {gameObject.input.enabled = true}
				})
			}

		});


		this.PosY = this.syst.YPosRow1;
		this.row1Dif = this.syst.YPosRow2;
		this.row2Dif = this.syst.YPosRow3;
		this.row3Dif = 350;


		for(var i = 1; i < 5; i++){
			var temp = 'row' + i;

			for(var j = 0; j < that[temp].length; j++){
				that[temp][j].displayWidth = that.picMaxWidth * (that.imageArray[that[temp][j].name].depth / 2);
				that[temp][j].depth = that.imageArray[that[temp][j].name].depth;
				if(that.imageArray[that[temp][j].name].direction == "Left"){
					that[temp][j].x = window.innerWidth
				}else{
					that[temp][j].x = 0 - that[temp][j].displayWidth;
				}
				console.log(this.imageArray[that[temp][j].name].positionY)
				if(this.imageArray[that[temp][j].name].positionY == ""){
					that[temp][j].y = this.PosY;
				}else{
					that[temp][j].y = this.imageArray[that[temp][j].name].positionY 
				}
				//var Height = that[temp][j].displayHeight;
			}

			var Height = 'row' + i + 'Dif';
			this.PosY = this[Height];
		}
		var timedEvent = this.time.addEvent({
			delay: this.sys.game.gameData.timer * 1000,
			callback: this.gameWin,
			callbackScope: this
		});
	}
	gameWin() {
		this.scene.start('WinScene', { t: this.correct})
	}



	spawn(waitrow, max, min) {
		if(waitrow.length == 0){
			this.spawn(waitrow,max,min)
			return
		}else{
			var element = Math.floor(Math.random() * waitrow.length)
			var dirTemp = 'move' + this.imageArray[waitrow[element]].direction;
			this[dirTemp].push(this.loadedImages[waitrow[element]]);
			waitrow.splice(element,1);

			this.time.addEvent( {
				delay: Math.floor(Math.random() * (max - min) + min),
				callback:this.spawn,
				callbackScope: this,
				args: [waitrow, max, min]
			});
		}
	}


	update(){
		for(var i = 0; i < this.moveRight.length; i++){
			this.moveRight[i].x += 5;
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
			this.moveLeft[i].x -= 5;
			if(this.moveLeft[i].x < (0 - this.moveLeft[i].displayWidth - this.moveLeft[i].displayWidth)){
				this.moveLeft[i].x = window.innerWidth;
				var temp = 'waitrow' + this.imageArray[this.moveLeft[i].name].depth
				this[temp].push(this.moveLeft[i].name);
				this.moveLeft.splice(i,1)
			}
		}

	}

}

export default gameScene;
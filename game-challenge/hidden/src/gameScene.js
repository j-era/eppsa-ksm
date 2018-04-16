class gameScene extends Phaser.Scene {
	constructor () {
		super({
			key: 'gameScene',
		});
	}

	preload() {
		this.load.image('puppy', '/img/bsp1.jpg');
		this.load.image('kitty', '/img/kitty.jpg');
		this.load.image('piggy', '/img/piggy.jpg');

	}

	create() {

		this.imageArray = {
			"puppy" :{'img': 'puppy', 'tag': 'cute,doggie,is,pure,love', 'direction' : 'Right','depth':'1'},
			"kitty" : {'img': 'kitty', 'tag': 'sad,kitty', 'direction': 'Right', 'depth': '1'},
			"piggy" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Schwein" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Katze" : {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '3'},
			"Hund" : {'img': 'puppy', 'tag': 'cute,doggie,is,fluff', 'direction': 'Right', 'depth':'3'},

			"puppy1" :{'img': 'puppy', 'tag': 'cute,doggie,needs,love', 'direction' : 'Right', 'depth': '1'},
			"kitty1" : {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '1'},
			"piggy1" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Schwein1" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Katze1" : {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '3'},
			"Hund1" : {'img': 'puppy', 'tag': 'cute,doggie,makes,woof', 'direction': 'Right', 'depth': '3'},

			"puppy2" :{'img': 'puppy', 'tag': 'cute,doggie,wants,cuddles', 'direction' : 'Right', 'depth': '1'},
			"kitty2" : {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '1'},
			"piggy2" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Schwein2" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Katze2" : {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '3'},
			"Hund2" : {'img': 'puppy', 'tag': 'cute,doggie,kiss', 'direction': 'Right', 'depth': '3'}
		};

		this.blockImages = {
			"block" : {'img': 'puppy', 'positionX' : '5', 'positionY' : '10', 'depth': '4'},
			"block1" : {'img': 'kitty', 'positionX' : '50', 'positionY' : '150', 'depth': '4'},
			"block2" : {'img': 'piggy', 'positionX' : '20', 'positionY' : '500', 'depth': '4'},
			"block3" : {'img': 'piggy', 'positionX' : '60', 'positionY' : '750', 'depth': '4'},
		};

		this.picMaxWidth = window.innerWidth/3;
		this.picMaxHeight = this.picMaxWidth*0.75;

		for(var blockElements in this.blockImages){
			var blocking = this.add.image(this.blockImages[blockElements].positionX,this.blockImages[blockElements].positionY, this.blockImages[blockElements].img).setOrigin(0,0).setName(imageKey).setInteractive();
			blocking.displayWidth = this.picMaxWidth;
			blocking.displayHeight = this.picMaxHeight;
			blocking.depth = this.blockImages[blockElements].depth;
			blocking.eppsaInactive = true;
		}

		this.loadedImages = {};

		for(var imageKey in this.imageArray){
			var image = this.add.image(0,0, this.imageArray[imageKey].img).setOrigin(0,0).setInteractive().setName(imageKey);
			this.loadedImages[imageKey] = image;
		}

		this.pos = 50;



		this.questions = [
		{question: 'Finde alle süßen Hunde!', tag: 'cute,doggie'},
		{question: 'Wo ist das Babykätzchen?', tag: 'cute,kitty'}];

		this.random = Math.floor(Math.random() * this.questions.length);

		this.TempTags = this.questions[this.random].tag.split(',');

		this.QuesText = this.questions[this.random].question;

		this.ques = this.add.text(window.innerWidth/2, window.innerHeight*0.9, 'Hey',{ font: window.innerHeight/35 + 'px Arial', fill: 'green'});

		this.ques.setText(this.QuesText);

		var that = this;

		this.lastDepth = 4;

		this.row1 = [];
		this.row2 = [];
		this.row3 = [];
		this.moveLeft = [];
		this.moveRight = [];

		this.waitrow1 = [];
		this.waitrow2 = [];
		this.waitrow3 = [];
		this.correct = 0;

		for(var element in this.imageArray){
			var i = 0;
			that.loadedImages[element].displayHeight = that.picMaxHeight * (that.imageArray[element].depth/2);
			var temp = 'row' + that.imageArray[element].depth;
			that[temp].push(that.loadedImages[element]);
			this['wait' + temp].push(element);	
		}


		var SpawnTimerRow1 = this.time.addEvent( {
			delay: Math.random() * (5000 - 2000) + 2000,
			callback:this.spawn,
			args: [this.waitrow1, 5000, 2000],
			callbackScope: this,
		});
		var SpawnTimerRow2 = this.time.addEvent( {
			delay: Math.random() * (5000 - 1000) + 1000,
			callback:this.spawn,
			args: [this.waitrow2, 5000, 1000],
			callbackScope: this,
		});		 
		var SpawnTimerRow3 = this.time.addEvent( {
			delay: Math.random() * (5000 - 3000) + 3000,
			callback:this.spawn,
			args: [this.waitrow3, 5000, 3000],
			callbackScope: this,
		})

		this.input.on('gameobjectdown', function(pointer, gameObject){
			if(gameObject.eppsaInactive != undefined && gameObject.eppsaInactive == true){
				return;
			}

			var count = 0;
			this.questionTags = that.questions[that.random].tag.split(',');
			this.testTags = that.imageArray[gameObject.name].tag.split(',');
			var bla = this;

			this.questionTags.forEach(function(tag) {
				for(var i = 0; i < bla.testTags.length; i++){
					if(tag == bla.testTags[i]){
						console.log(count)
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
					onComplete: function() {gameObject.input.enabled = true}
				})
			}

		});


		this.PosY = 350;
		this.row1Dif = 150;
		this.row2Dif = 50;
		for(var i = 1; i < 4; i++){
			var temp = 'row' + i;
			for(var j = 0; j < that[temp].length; j++){
				that[temp][j].displayWidth = that.picMaxWidth * (that.imageArray[that[temp][j].name].depth / 2);
				that[temp][j].depth = that.imageArray[that[temp][j].name].depth;
				if(that.imageArray[that[temp][j].name].direction == "Left"){
					that[temp][j].x = window.innerWidth
				}else{
					that[temp][j].x = 0 - that[temp][j].displayWidth;
				}
				that[temp][j].y = this.PosY;
				//var Height = that[temp][j].displayHeight;
			}
			var Height = 'row' + i + 'Dif';
			this.PosY += this[Height];
		}
		var timedEvent = this.time.addEvent({
			delay: 50000,
			callback: this.gameWin,
			callbackScope: this
		});
		//this.spawn();
	}
	gameWin() {
		this.scene.start('WinScene', { t: this.correct})
	}

	/*spawn() {
		var element = Math.floor(Math.random() * this.wait.length)
		if(this.wait.length > 0){
			if(this.imageArray[this.wait[element]].depth == this.lastDepth){
				this.spawn();
				return false;
			}
			this.lastDepth = this.imageArray[this.wait[element]].depth;
			var dirTemp = 'move' + this.imageArray[this.wait[element]].direction;
			this[dirTemp].push(this.loadedImages[this.wait[element]]);	
			this.wait.splice(element,1);
		}

	}*/

	spawn(waitrow, max, min) {
		var element = Math.floor(Math.random() * waitrow.length)
		var dirTemp = 'move' + this.imageArray[waitrow[element]].direction;
		this[dirTemp].push(this.loadedImages[waitrow[element]]);
		waitrow.splice(element,1);

		this.time.addEvent( {
			delay: Math.random() * (max - min) + min,
			callback:this.spawn,
			callbackScope: this,
			args: [waitrow, max, min]
		});
	}


	update(){
		for(var i = 0; i < this.moveRight.length; i++){
			this.moveRight[i].x += 5;
			if(this.moveRight[i].x > window.innerWidth){
				this.moveRight[i].x = 0 - this.moveRight[i].displayWidth;
				var temp = 'waitrow' + this.imageArray[this.moveRight[i].name].depth
				//console.log(temp)
				this[temp].push(this.moveRight[i].name);
				this.moveRight.splice(i,1);
			}
		}

		for(var i = 0; i < this.moveLeft.length; i++){
			this.moveLeft[i].x -= 5;
			if(this.moveLeft[i].x < (0 - this.moveLeft[i].displayWidth)){
				this.moveLeft[i].x = window.innerWidth;
				var temp = 'waitrow' + this.imageArray[this.moveLeft[i].name].depth
				this[temp].push(this.moveLeft[i].name);
				this.moveLeft.splice(i,1)
			}
		}

	}

}

export default gameScene;
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
			"puppy" :{'img': 'puppy', 'tag': 'small,doggie', 'direction' : 'Right', 'depth': '1'},
			"kitty" : {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '1'},
			"piggy" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Schwein" : {'img': 'piggy', 'tag': 'cute,piggy', 'direction': 'Left', 'depth': '2'},
			"Katze" : {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '3'},
			"Hund" : {'img': 'puppy', 'tag': 'small,doggie', 'direction': 'Right', 'depth': '3'}
		};

		this.loadedImages = {};

		for(var imageKey in this.imageArray){
			var image = this.add.image(0,0, this.imageArray[imageKey].img).setOrigin(0,0).setInteractive().setName(imageKey);
			this.loadedImages[imageKey] = image;
		}

		this.movingRight = 0;
		this.movingLeft = 0;

		this.pos = 50;

		this.picMaxWidth = window.innerWidth/3;
		this.picMaxHeight = this.picMaxWidth*0.75;

		this.questions = [
		{question: 'Finde alle süßen Tiere!', tag: 'cute,doggie'},
		{question: 'Wo ist das Babykätzchen?', tag: 'sad,kitty'}];

		this.random = Math.floor(Math.random() * this.questions.length);

		this.TempTags = this.questions[this.random].tag.split(',');

		this.QuesText = this.questions[this.random].question;

		this.ques = this.add.text(window.innerWidth/2, window.innerHeight*0.9, 'Hey',{ font: window.innerHeight/35 + 'px Arial', fill: 'green'});

		this.ques.setText(this.QuesText);

		var that = this;

		this.row1 = [];
		this.row2 = [];
		this.row3 = [];
		this.moveLeft = [];
		this.moveRight = [];
		this.wait = [];
		this.correct = 0;
		for(var element in this.imageArray){
			var i = 0;
			that.loadedImages[element].displayHeight = that.picMaxHeight * (that.imageArray[element].depth/2);
			var temp = 'row' + that.imageArray[element].depth;
			that[temp].push(that.loadedImages[element]);
			this.wait.push(element)
			
		}


		this.input.on('gameobjectdown', function(pointer, gameObject){

			this.questionTags = that.questions[that.random].tag.split(',');
			this.testTags = that.imageArray[gameObject.name].tag.split(',');

			for(var i = 0; i < this.questionTags.length; i++){
				for(var j = 0; j < this.testTags.length; j++){
					if(this.questionTags[i] == this.testTags[j]){
						this.correct += 1
						gameObject.input.enabled = false;
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

				}
			}

		});


		this.PosY = 0;
		for(var i = 1; i < 4; i++){
			var temp = 'row' + i;
			for(var j = 0; j < that[temp].length; j++){
				that[temp][j].displayWidth = that.picMaxWidth * (that.imageArray[that[temp][j].name].depth / 2);
				that[temp][j].x = 0 - (2 * that[temp][j].displayWidth);
				that[temp][j].y = this.PosY;
				var Height = that[temp][j].displayHeight;
			}
			this.PosY += Height * 0.75;
		}

		var timedEvent = this.time.addEvent({
			delay: 600000,
			callback: this.gameWin,
			callbackScope: this
		});

		var SpawnTimer = this.time.addEvent( {
			delay: 2000,
			callback:this.spawn,
			callbackScope: this,
			loop: true
		})
		this.spawn();

	}
	gameWin() {
		this.scene.start('WinScene', { t: this.correct})
	}

	spawn() {
		var element = Math.floor(Math.random() * this.wait.length)
		console.log(element)
		if(this.wait.length > 0){
			var dirTemp = 'move' + this.imageArray[this.wait[0]].direction;
			this[dirTemp].push(this.loadedImages[this.wait[0]]);	
			console.log(this.wait)
			this.wait.splice(0,1);
			console.log(this.wait)
		}
	}

	update(){

		for(var i = 0; i < this.moveRight.length; i++){
			this.moveRight[i].x += 5;
			//this.moveRight[i].x += this.imageArray[this.wait[0]].depth;
			if(this.moveRight[i].x > window.innerWidth){
				this.moveRight[i].x = 0 - this.moveRight[i].displayWidth;
				this.wait.push(this.moveRight[i].name);
				this.moveRight.splice(i,1);

				this.movingRight  = 0;
			}
		}

		for(var i = 0; i < this.moveLeft.length; i++){
			this.moveLeft[i].x -= 5;
			if(this.moveLeft[i].x < (0 - this.moveLeft[i].displayWidth)){
				this.moveLeft[i].x = window.innerWidth;
				this.moveLeft.splice(i,1)
				this.movingLeft  = 0;
			}
		}

	}

}

export default gameScene;
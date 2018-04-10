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
		this.haveToClick = [];

		for(var element in this.imageArray){
			var i = 0;
			that.loadedImages[element].displayHeight = that.picMaxHeight;

			var temp = 'row' + that.imageArray[element].depth;
			that[temp].push(that.loadedImages[element]);
			var dirTemp = 'move' + that.imageArray[element].direction;
			that[dirTemp].push(that.loadedImages[element]);	
		}
		this.Testfun();


		this.input.on('gameobjectdown', function(pointer, gameObject){


			for(var i = 0; i < that.haveToClick.length; i++){
				if(gameObject == that.haveToClick[i]){
					that.haveToClick.splice(i,1);
					i=0;
					that.tweens.add( {
						targets: gameObject,
						scaleX: 0.5,
						scaleY: 0.5,
						ease: 'Sine.easeOut',
						duration: 500,
						repeat: 0,
						yoyo: true
					})
				}
			}
			if(that.haveToClick == 0){
				that.questions.splice(that.random,1);
				console.log(that.questions.length)
				if(that.questions.length == 0){
					that.scene.start('WinScene');
				}else{
					that.changeQuestion();
					that.Testfun();
				}
			}

		});


		this.PosY = 0;
		for(var i = 1; i < 4; i++){
			var PosX = 0;
			var temp = 'row' + i;
			for(var j = 0; j < that[temp].length; j++){
				that[temp][j].displayWidth = that.picMaxWidth;
				that[temp][j].x = PosX;
				PosX += that[temp][j].displayWidth;
				that[temp][j].y = this.PosY;
				var Height = that[temp][j].displayHeight;
			}
			this.PosY += Height * 0.75;
		}
	}


	update(){


		for(var i = 0; i < this.moveRight.length; i++){
			this.moveRight[i].x += 5;
			if(this.moveRight[i].x > window.innerWidth){
				this.moveRight[i].x = 0;
				this.movingRight  = 0;
			}
		}

		for(var i = 0; i < this.moveLeft.length; i++){
			this.moveLeft[i].x -= 5;
			if(this.moveLeft[i].x < (0 - this.moveLeft[i].displayWidth)){
				this.moveLeft[i].x = window.innerWidth;
				this.movingLeft  = 0;
			}
		}

	}

	Testfun() {
		this.haveToClick = [];
		for(var element in this.imageArray){
			this.testTags = this.imageArray[element].tag.split(',');
			this.questionTags = this.questions[this.random].tag.split(',');
			for (var i = 0; i < this.testTags.length; i++) {
				for(var j = 0; j < this.questionTags.length; j++){
					if(this.testTags[i] == this.questionTags[j]){
						this.haveToClick.push(this.loadedImages[element])
					}
				}
			};	
		}
	}

	changeQuestion(){
		//this.questions.splice(this.random,1);
		if(this.questions.length > 0){
			this.random = Math.floor(Math.random() * this.questions.length);

			this.QuesText = this.questions[this.random].question;

			this.ques.setText("Ja^^")

			this.add.tween({
				targets: this.ques,
				duration: 1000,
				alpha: {
					getStart: () => 1,
					getEnd: () => 0.1
				},
				onComplete: () => {
					this.ques.setText(this.QuesText);
					this.ques.alpha = 1;
				}
			})
		}else{
			this.scene.start('WinScene');
		}
	}

}

export default gameScene;
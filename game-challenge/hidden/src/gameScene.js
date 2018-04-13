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

		this.imageArray = [
		this.puppy = {'img': 'puppy', 'tag': 'good,doggie', 'direction' : 'Right', 'depth': '1'},
		this.kitty = {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'Right', 'depth': '1'},
		this.piggy = {'img': 'piggy', 'tag': 'litty,piggy', 'direction': 'Left', 'depth': '2'}
		];

		this.loadedImages = {};

		for (var i = 0; i < this.imageArray.length; i++){
			var image = this.add.image(0,0, this.imageArray[i].img).setOrigin(0,0).setInteractive().setName(this.imageArray[i].img);
			this.loadedImages[this.imageArray[i].img] = image;
		}


		this.movingRight = 0;
		this.movingLeft = 0;

		this.pos = 50;

		this.picMaxHeight = 300;
		this.picMaxWidth = 300;

		this.questions = [
		{question: 'Wo ist das kleine Schweinchen?', tag: 'piggy,teacup,little,squeak'},
		{question: 'Wo ist das Babykätzchen?', tag: 'sad,kitty'}];

		this.random = Math.floor(Math.random() * this.questions.length);

		this.QuesText = this.questions[this.random].question;

		this.ques = this.add.text(window.innerWidth/2, window.innerHeight*0.9, 'Hey',{ font: window.innerHeight/35 + 'px Arial', fill: 'green'});

		this.ques.setText(this.QuesText);

		var that = this;

		this.row1 = [];
		this.row2 = [];
		this.row3 = [];
		this.moveLeft = [];
		this.moveRight = [];

		this.imageArray.forEach(function(element) {
			var i = 0;
			that.loadedImages[element.img].displayHeight = window.innerHeight/3;
			if(that.loadedImages[element.img].displayHeight > that.picMaxHeight){
				that.loadedImages[element.img].displayHeight = that.picMaxHeight;
			}

			var temp = 'row' + element.depth;
			that[temp].push(that.loadedImages[element.img]);
			var dirTemp = 'move' + element.direction;
			that[dirTemp].push(that.loadedImages[element.img]);

			that.loadedImages[element.img].on('pointerup', function(pointer){
				var found = false;
				var temp = element.tag.split(',');
				var temp2 = that.questions[that.random].tag.split(',');
				for(var i = 0; i < temp.length; i++){
					for(var j = 0; j < temp2.length; j++){
						if(temp[i] == temp2[j]){
							found = true;
							that.changeQuestion();
							break;
						}else{
							that.QuesText = that.questions[that.random].question;
							if(found == false){
								that.ques.setText("Nope");
								that.add.tween({
									targets: that.ques,
									duration: 1000,
									alpha: {
										getStart: () => 1,
										getEnd: () => 0.1
									},
									onComplete: () => {
										that.ques.setText(that.QuesText);
										that.ques.alpha = 1;
									}
								})
							}
							
						}

					}
				}
			})

		});

this.PosY = 0;
for(var i = 1; i < 4; i++){
	var PosX = 0;
	var temp = 'row' + i;
	for(var j = 0; j < that[temp].length; j++){
		that[temp][j].displayWidth = window.innerWidth/that[temp].length
		that[temp][j].x = PosX;
		PosX += that[temp][j].displayWidth;
		that[temp][j].y = this.PosY;
		var Height = that[temp][j].displayHeight;
	}
	this.PosY += Height;
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
		if(this.moveLeft[i].x < -(window.innerWidth)){
			this.moveLeft[i].x = window.innerWidth;
			this.movingLeft  = 0;
		}
	}

}

changeQuestion(){
	this.questions.splice(this.random,1);
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
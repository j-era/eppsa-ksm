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
		this.puppy = {'img': 'puppy', 'tag': 'good,doggie', 'direction' : 'right', 'depth': '1'},
		this.kitty = {'img': 'kitty', 'tag': 'cute,kitty', 'direction': 'right', 'depth': '1'},
		this.piggy = {'img': 'piggy', 'tag': 'litty,piggy', 'direction': 'left', 'depth': '2'}
		];

		this.loadedImages = {};

		for (var i = 0; i < this.imageArray.length; i++){
			var image = this.add.image(0,0, this.imageArray[i].img).setOrigin(0,0).setInteractive();
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

		this.imageArray.forEach(function(element) {
			var i = 0;
			that.loadedImages[element.img].displayHeight = window.innerHeight/3;
			if(that.loadedImages[element.img].displayHeight > that.picMaxHeight){
				that.loadedImages[element.img].displayHeight = that.picMaxHeight;
			}

			var temp = 'row' + element.depth;
			that[temp].push(that.loadedImages[element.img]);

			//TODO sort pics + width

			that.loadedImages[element.img].on('pointerup', function(pointer){
				var found = false;
				var temp = element.tag.split(',');
				console.log(temp);
				var temp2 = that.questions[that.random].tag.split(',');
				console.log(temp2);
				for(var i = 0; i < temp.length; i++){
					for(var j = 0; j < temp2.length; j++){
						if(temp[i] == temp2[j]){
							console.log("yes")
							found = true;
							break;
							//TODO change question
						}else{
							console.log("No")
							//TODO response
						}

					}
				}
			})

		})

		this.PosY = 0;
		for(var i = 1; i < 4; i++){
			var PosX = 0;
			var temp = 'row' + i;
			console.log(temp)
			for(var j = 0; j < that[temp].length; j++){
				that[temp][j].displayWidth = window.innerWidth/that[temp].length
				that[temp][j].x = PosX;
				PosX += that[temp][j].displayWidth;
				that[temp][j].y = this.PosY;
				console.log(that[temp][j].y)
				var Height = that[temp][j].displayHeight;
			}
			this.PosY += Height;
		}
	}


	update(){
			//TODO movement of pics
		}

		/*for(var k = 0; k < this.Depth1.length; k++){
			this.Depth1[k].displayWidth = window.innerWidth/this.Depth1.length;

			if(this.Depth1[k].displayWidth > this.picMaxWidth){
				this.Depth1[k].displayWidth = this.picMaxWidth;
			}
			this.Depth1[k].y = this.pos;
			if(k == this.Depth1.length-1){
				this.pos += this.Depth1[k].displayHeight/4;
			}
		}
		
		for(var l = 0; l < this.Depth2.length; l++){
			this.Depth2[l].displayWidth= window.innerWidth/this.Depth2.length;

			if(this.Depth2[l].displayWidth > this.picMaxWidth){
				this.Depth2[l].dispalyWidth = this.picMaxWidth;
			}

			this.Depth2[l].y = this.pos;
			if(l == this.Depth2.length-1){
				this.pos += this.Depth2[l].displayHeight/4;
			}
		}

		for(var k = 0; k < this.Depth3.length; k++){
			this.Depth3[k].width= window.innerWidth/this.Depth3.length;

			if(this.Depth3[k].width > this.picMaxWidth){
				this.Depth3[k].width = this.picMaxWidth;
			}

			this.Depth3[k].style.top = this.pos;
			if(k == this.Depth3.length-1){
				this.pos += this.Depth3[k].height/4;
			}
		}*/

	}

	export default gameScene;
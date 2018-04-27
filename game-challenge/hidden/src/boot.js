import Phaser from "./phaser.min";

class Boot extends Phaser.Scene {
	constructor () {
		super({key: 'BootScene'})
	}

	preload () {
		var scope = this;
		this.load.image("icon", process.env.ASSET_SERVER_URI + "/" + scope.sys.game.gameData.assets["icon"].image.src);
	}

	create () {

		var timedEvent = this.time.addEvent({
			delay: 2000,
			callback: this.start,
			callbackScope: this
		});

		this.questions = [];

		for(var element in this.sys.game.gameData.questions){
			if(element == "template"){
				continue;
			}else{
				this.questions.push(this.sys.game.gameData.questions[element]);

			}
		}
		this.random = Math.floor(Math.random() * this.questions.length);
		this.tempTags = this.questions[this.random].tag.split(',');
		this.QuesText = this.questions[this.random].question;

		this.ques = this.add.text(window.innerWidth/2, window.innerHeight/1.5, 'Hey',{ font: window.innerHeight/35 + 'px Arial', fill: 'grey'});
		this.ques.setText(this.QuesText);
		this.ques.setOrigin(0.5,0,5);

		let circleColor = this.sys.game.color.replace("#", "0x");
		var graphics = this.add.graphics({ lineStyle: { width: 6, color: circleColor} });
		var circle = new Phaser.Geom.Circle(window.innerWidth/2, window.innerHeight/3, window.innerWidth/4);

		function drawCircle ()
		{
			var area = Phaser.Geom.Circle.Area(circle);
			graphics.strokeCircleShape(circle);
		}
		drawCircle(graphics, circle);
		this.icon = this.add.image(window.innerWidth/2, window.innerHeight/3, "icon").setScale(0.3);
		this.icon.setScale(window.innerWidth/this.icon.width * 0.4);
		
		graphics.setDepth(1);
		
	}

	start() {
		//console.log(this.tempTags)
		this.scene.start('gameScene', {QuestionTags: this.tempTags});
		//console.log("I am the BootScene!");
	}
}

export default Boot;
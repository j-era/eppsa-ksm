import Phaser from "./phaser.min";

class Boot extends Phaser.Scene {
	constructor () {
		super({key: 'BootScene'})
	}

	preload () {

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

		this.ques = this.add.text(window.innerWidth - (window.innerWidth/1.5), window.innerHeight/2, 'Hey',{ font: window.innerHeight/35 + 'px Arial', fill: 'blue'});

		this.ques.setText(this.QuesText);



		
	}

	start() {
		//console.log(this.tempTags)
		this.scene.start('gameScene', {QuestionTags: this.tempTags});
		//console.log("I am the BootScene!");
	}
}

export default Boot;
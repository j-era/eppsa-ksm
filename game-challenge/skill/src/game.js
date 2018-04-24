import client from "socket.io-client"
import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"
import Phaser from "./phaser"

let socket;
let orientation;
let gameData;
let gameCallbacks;
let shared;

let singleplayer = false;

bootstrap((config, { callbacks }) => {
	console.log(config);
	gameData = config.challenge;
	gameCallbacks = callbacks;
	shared = config.shared;

	//config.room = 1;
	if(config.room && config.room != null){
		socket = client(config.gameServerUri, { secure: true })
		socket.on("clientsInRoom", (clientsInRoom) =>
		  console.log(`Clients in the room: ${JSON.stringify(clientsInRoom)}`)
		)
		socket.on("connect", () => socket.emit("joinRoom", config.room))
	}else{
		singleplayer = true;
	}

	init();
  });


let SkillGameAirship = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function SkillGameAirship(){
		Phaser.Scene.call(this, { key: 'skillGameAirship' });

		this.timer = gameData.timer;
		this.score = 0;
		this.countdown = gameData.countdown;		//Sets the time (usually 3 s) in which the player can prepare before the game starts.
		this.minTilt = gameData.minTilt;		//Define the threshold of the range in which the tilt input will have effect on the game controls.
		this.maxTilt = gameData.maxTilt;			//Define the threshold of the range in which the tilt input will have effect on the game controls.
		this.sensitivity = gameData.sensitivity;		//Value to influence the ratio which translates tilt angle of mobile device to rotation angle of game object.

		this.vehicleAngle = gameData.vehicleAngle;	//Defines the max. angle in which Player A can steer the ship left or right.
		this.inertia = gameData.inertia;		//0.x Factor that delays the execution of the vehicle's controls, to simulate its inertia.
		this.vehicleWinAngle = gameData.vehicleWinAngle;	//Defines the angle in which Player A has to keep the ship within, to possibly reach win-state. The win-state is only triggered if Player B is within StreamWinAngle.

		this.streamRange = gameData.streamRange;		//Defines the max. angle in which the Player B can veer the Stream's vector.
		this.streamForce = gameData.streamForce;		//Factor with which the force of stream's vector can be adjusted.
		this.streamWinAngle = gameData.streamWinAngle;	//Defines the angle in which Player B has to keep the stream's vector within, to possibly reach win-state. The win-state is only triggered if Player A's ship is within VehicleWinAngle.
	
		this.destabiliser = gameData.destabiliser;	//0.0x Factor that is multiplied with the time spent within win-state. The closer the product reaches 1, the more Sensitivity will increase, possibly throwing them out of win-state.
	
		this.NPCHorizontalStay = gameData.npcHorizontalStay;	//Sets the probability with which the NPC stays in its horizontal state.
		this.NPCHorizontalExit = gameData.npcHorizontalExit;	//Sets the probability with which the NPC goes from horizontal state to tilt state.
		this.NPCTiltStay = gameData.npcTiltStay;			//Sets the probability with which the NPC stays in its tilt state.
		this.NPCTiltExit = gameData.npcTiltExit;			//Sets the probability with which the NPC goes form tilt state to horizontal state.
		
		//other variables needed
		this.vehiclearrow;
		this.streamArrow;
		//this.rotationText;

		this.countdownTimer;
		this.countdownText;
		this.currentCountdownValue = this.countdown;
		this.gameStarted = false;

		this.gameTimer = 0;
		//this.timeLeft;

		this.timeInWinState = 0;
		this.currentlyInWinState = false;
		this.lastTimeInWinState = false;
		this.currentTimeInWinState = 0;

		this.width = window.innerWidth ;
		this.height = window.innerHeight ;
	
		this.NPCState = 'horizontal';
		this.npcStates = ['horizontal', 'tilt']; 
		this.npcHorizontalWeight = [this.NPCHorizontalStay, this.NPCHorizontalExit];
		this.npcTiltWeight = [this.NPCTiltExit, this.NPCTiltStay];

		this.singleplayer = singleplayer;
		
	},

	preload: function(){
		for(var key in gameData.assets){
			if(key == "template"){
				continue;
			}
			this.load.image(gameData.assets[key].name, process.env.ASSET_SERVER_URI + "/" + gameData.assets[key].image.src);
		}
	}, 

	create: function(data){
		//setup gameboard
		//this.timeLeft = this.add.graphics();
		this.cloud1 = this.add.image(this.width/3, -200, 'cloud1').setScale(0.2);
		this.cloud2 = this.add.image(2 * this.width/3, -100, 'cloud2').setScale(0.2);
		this.cloud3 = this.add.image(3 * this.width/4, -500, 'cloud3').setScale(0.2);

		this.tweens.add({
			targets: this.cloud1,
			y: this.height + 200,
			duration: 10 * this.height,
			ease: 'Sine.easeInOut',
			loop: true,
			loopDelay: 400
		});

		this.tweens.add({
			targets: this.cloud2,
			y: this.height + 300,
			duration: 15 * this.height,
			ease: 'Sine.easeInOut',
			loop: true,
			loopDelay: 900
		});

		this.tweens.add({
			targets: this.cloud3,
			y: this.height + 200,
			duration: 20 * this.height,
			ease: 'Sine.easeInOut',
			loop: true,
			loopDelay: 100
		});

		//text for debugging
		//this.rotationText = this.add.text(10, 10, 'phaser', {fill: '#000000'});
		

		if(this.singleplayer){
			this.singleplayer = true;
			this.playingShip = true;

			this.windImage = this.add.image(this.width, this.height/2, 'wind').setOrigin(1,1);
			this.windImage.setScale(this.width/this.windImage.width, this.width/this.windImage.width);

			this.vehicleImage = this.add.image(this.width/2, this.height/2 + this.height/6, 'vehicle').setOrigin(0.5, 0).setScale(0.15);

			this.streamArrow = this.add.image(this.width/2,this.height/2 - this.height/8, 'windArrowSmall').setOrigin(0.5,1).setScale(0.2);
			this.vehicleArrow = this.add.image(this.width/2, this.height/2 + 10, 'vehicleArrowLarge').setOrigin(0.5,0).setScale(0.2);

			this.windDirectionLeft = this.add.image(this.width/4, this.height/6, 'windDirection').setScale(0.2);
			this.windDirectionRight = this.add.image(3 * this.width/4, this.height/3, 'windDirection').setScale(0.2);

			this.countdownText = this.add.text(this.width/2, this.height/2, this.countdown, {font: '60px Arial', fill: '#000000'});
			this.countdownTimer = this.time.addEvent({delay: 1000, callback: this.countdownFunc, callbackScope: this, repeat: this.countdown});
		}else{
			//server code
			console.log('starting a new game with ', data);
			this.ownID = data.own;
			this.opponentID = data.match;

			console.log("This player is playing as " + data.playing);

			if(data.playing == 'ship'){
				this.playingShip = true;
				this.windImage = this.add.image(this.width, this.height/2, 'wind').setOrigin(1,1);
				this.windImage.setScale(this.width/this.windImage.width, this.width/this.windImage.width);

				this.vehicleImage = this.add.image(this.width/2, this.height - this.height/6, 'vehicle').setOrigin(0.5, 0).setScale(0.15);

				this.streamArrow = this.add.image(this.width/2,this.height/2 - this.height/8, 'windArrowSmall').setOrigin(0.5,1).setScale(0.2);
				this.vehicleArrow = this.add.image(this.width/2, this.height/2 + 10, 'vehicleArrowLarge').setOrigin(0.5,0).setScale(0.2);

				this.windDirectionLeft = this.add.image(this.width/4, this.height/6, 'windDirection').setScale(0.2);
				this.windDirectionRight = this.add.image(3 * this.width/4, this.height/3, 'windDirection').setScale(0.2);
			}else{
				this.playingShip = false;
				this.windImage = this.add.image(0, this.height/2, 'wind').setOrigin(0, 0);
				this.windImage.flipY = -1;
				this.windImage.setScale(this.width/this.windImage.width);
				
				this.vehicleImage = this.add.image(this.width/2, this.height/6, 'vehicle').setOrigin(0.5, 0).setScale(0.15);
				this.vehicleImage.flipY = -1;

				this.streamArrow = this.add.image(this.width/2,this.height/2 + this.height/8, 'windArrowLarge').setOrigin(0.5,1).setScale(0.2);
				this.vehicleArrow = this.add.image(this.width/2, this.height/2 - 10, 'vehicleArrowSmall').setOrigin(0.5,0).setScale(0.2);

				this.windDirectionLeft = this.add.image(this.width/4, this.height-this.height/6, 'windDirection').setScale(0.2);
				this.windDirectionRight = this.add.image(3 * this.width/4, this.height-this.height/3, 'windDirection').setScale(0.2);
			}

			Client.readyToPlay({'own' : this.ownID, 'other': this.opponentID});
		}

		this.pointHUD = this.add.image(this.width/2, this.height, 'pointHUD').setOrigin(0.5, 1).setScale(0.2);
		this.scoreText = this.add.text(this.width/2, this.height, "0 Punkte", {font: '16px Cabin', fill: '#ffffff'}).setOrigin(0.5, 1);
		
	},

	startMultiplayerGame: function(){
		this.countdownText = this.add.text(this.width/2, this.height/2, this.countdown, {font: '60px Arial', fill: '#000000'});
		this.countdownTimer = this.time.addEvent({delay: 1000, callback: this.countdownFunc, callbackScope: this, repeat: this.countdown});
	},

	update: function(){
		if(this.gameStarted){
			this.lastTimeInWinState = this.currentlyInWinState;
			this.currentlyInWinState = this.checkIfWinState();

			this.vehicleImage.angle = this.vehicleArrow.angle;
			this.windDirectionLeft.angle = this.streamArrow.angle;
			this.windDirectionRight.angle = this.streamArrow.angle;

			if(!this.lastTimeInWinState && this.currentlyInWinState ){
				console.log("starting Winning counter");
				//this.rotationText.setStyle({color: '#ff00ff', fontSize: '50px'});
				this.winStateCounter = this.time.addEvent({delay: 1000, callback: this.increaseWinStateTime, callbackScope: this, loop: true});
			}

			if(this.lastTimeInWinState && !this.currentlyInWinState){
				console.log("stopping Winning counter");
				//this.rotationText.setStyle({color: '#ff0000', fontSize: '20px'});
				this.winStateCounter.remove(false);
				this.currentTimeInWinState = 0;
			}		
		}
	},

	calculateScore: function(){
		return gameData.rewardValue * this.timeInWinState * shared.config.skillScoreFactor;
	},

	increaseWinStateTime: function(){
		console.log('increasing win state time');
		console.log("Hey");
		this.scoreText.setText(this.calculateScore() + " Punkte");
		this.timeInWinState ++;
		this.currentTimeInWinState ++;
		this.sensitivity += 1 - this.destabiliser * this.currentTimeInWinState
	},

	countdownFunc: function(){
		if(this.currentCountdownValue >= 1){
			this.currentCountdownValue --;
			this.countdownText.setText(this.currentCountdownValue);
		}
		else{
			this.countdownText.destroy();
			this.gameTimer = this.time.addEvent({delay: 1000 * this.timer, callback: this.onGameEnd, callbackScope: this, startAt: 0 });
			this.gameStarted = true;

			//start listening for device Orientation
			var currentGameScene = this;
			this.listenerFunc = function(){
				//console.log(event);
				if (event.data.type === "deviceOrientation") {
					orientation = event.data.data
					console.log('movement detected');
					currentGameScene.handleOrientation(orientation);
				}
			}
			//window.addEventListener("deviceorientation", this.listenerFunc, true);
			window.addEventListener("message", this.listenerFunc, true);

			if(this.singleplayer){
				this.timedEvent = this.time.addEvent({ delay: 300, callback: this.onEventRotateSingleplayer, callbackScope: this, loop: true });
			}
		}

	},

	onGameEnd: function(){
		window.removeEventListener("message", this.listenerFunc, true);
		this.winStateCounter.remove(false);
		this.gameStarted = false;

		//this.rotationText.setText("Game Ended, \n time in winning State " + this.timeInWinState);
		let score = this.timeInWinState * 100;

		if(this.singleplayer){
			this.sendScore(this.calculateScore());
		}else{
			Client.FinalScore({'own' : this.ownID, 'other': this.opponentID, 'score': score});
		}
	},

	sendScore: function(score){
		gameCallbacks.finishChallenge(score)
		/*gameClient.source.postMessage(
			{
			  source: "challenge",
			  score,
			  id: "finish"
			}, gameClient.origin)*/
	},

	rand: function(min, max){
		return Math.random() * (max - min) + min;
	},

	getRandomItem: function(list, weight){
		var total_weight = weight.reduce(function (prev, cur, i, arr) {
			return prev + cur;
		});
		 
		var random_num = this.rand(0, total_weight);
		var weight_sum = 0;
		//console.log(random_num)
		 
		for (var i = 0; i < list.length; i++) {
			weight_sum += weight[i];
			weight_sum = +weight_sum.toFixed(2);
			 
			if (random_num <= weight_sum) {
				return list[i];
			}
		}
	},

	onEventRotateSingleplayer: function(){
		let newState;
		if(this.NPCState == 'horizontal'){
			newState = this.getRandomItem(this.npcStates, this.npcHorizontalWeight);
		}else{
			newState = this.getRandomItem(this.npcStates, this.npcTiltWeight);
		}
		//console.log('newState ', newState);
		if(newState == 'horizontal'){
			this.streamArrow.angle = 0;
		}else{
			this.streamArrow.angle = this.rand(-this.streamRange, this.streamRange);
		}

		//this.streamArrow.angle = Math.random() * (15 - (-14)) + (-15);
	},

	moveOpponentArrow: function(data){
		if(this.playingShip){
			this.streamArrow.angle = data;
		}else{
			this.vehicleArrow.angle = data;
		}
	},

	handleOrientation: function(e){
		let that = this;
		//this.rotationText.setText("Rotated by " + event.gamma);

		let orientationGamma = e.gamma;
		console.log(orientationGamma);
	
		//clamp value of tilt input to minTilt and maxTilt as defined in backend
		orientationGamma = orientationGamma <= that.minTilt ? that.minTilt : orientationGamma >= that.maxTilt ? that.maxTilt : orientationGamma;
		let newRotation = orientationGamma * that.sensitivity;
	
		if(this.playingShip){
			//clamp value of newRotation to vehicleAngle and negative vehicleAngle
			newRotation = newRotation <= -that.vehicleAngle ? -that.vehicleAngle : newRotation >= that.vehicleAngle ? that.vehicleAngle : newRotation;
			let orientatationEvent = that.time.addEvent({delay: that.inertia * 1000, callback: that.rotateArrow, args: [that.vehicleArrow, newRotation], callbackScope: that});
		}else{
			//clamp value of newRotation to streamRange and negative streamRange
			newRotation = newRotation <= -that.streamRange ? -that.streamRange : newRotation >= that.streamRange ? that.streamRange : newRotation;
			let orientatationEvent = that.time.addEvent({delay: 0, callback: that.rotateArrow, args: [that.streamArrow, newRotation], callbackScope: that});
		}
		
	},

	rotateArrow: function(arrow, newRotation){
		arrow.angle = newRotation;
		console.log('rotating arrow', arrow, newRotation);
		//Client.ArrowChange({'rotation': newRotation, 'sender': this.ownID, 'listener': this.opponentID});
	},

	checkIfWinState: function(){
		//if gameScene.vehicleArrow.angle within VehicleWinAngle && gameScene.streamArrow.angle within StreamWinAngle 
		if(this.checkIfWithinAngle(this.vehicleArrow.angle, this.vehicleWinAngle) && this.checkIfWithinAngle (this.streamArrow.angle, this.streamWinAngle) ){
			return true;
		}
	},

	checkIfWithinAngle: function(currentAngle, range){
		if(-range <= currentAngle && currentAngle <= range){
			return true;
		}
		return false;
	}

});

 
var wfconfig = {
    active: function() { 
        console.log("font loaded");
       
    },
    google: {
        families: ['Cabin', 'Sniglet']
    }
};
 
WebFont.load(wfconfig);

// our game's configuration
let config = {
	type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
	width: window.innerWidth /** window.devicePixelRatio*/, // game width
	height: window.innerHeight /** window.devicePixelRatio*/, // game height
	backgroundColor: "#F2FCFF",
	parent: 'game',
	displayVisibilityChange: true,
	scene: [ SkillGameAirship ] // our newly created scene
  };

let game;  

  let init = function(){
	// create the game, and pass it the configuration
	game = new Phaser.Game(config);
  }
  
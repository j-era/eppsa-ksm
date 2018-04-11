let gameClient;

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
}

let MatchmakingLobby = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function MatchmakingLobby(){
		Phaser.Scene.call(this, { key: 'matchmakingLobby' });
	},

	preload: function(){
		this.load.image('singleplayer', 'assets/singleplayer.jpg');
	},

	create: function(){
		var gameScene = this;
		this.welcomeText = this.add.text(10, 10, 'waiting for a second player', {font: '12px Arial', fill: '#000000'});

		this.add.image(250, 50, 'singleplayer').setInteractive().on('pointerdown', function (pointer) {

			gameScene.scene.start('skillGameAirship', {'type' : 'singleplayer'});
	
		});;

		//server code
		this.connectedPlayers = {};
		this.ownID = 0;
		Client.askNewPlayer();


	},

	showMatchingStatus: function(info){
		this.welcomeText.setText(info);
	},

	startGameWithMatchedPartner: function(match){
		this.scene.start('skillGameAirship', {'type': 'multiplayer', 'match': match.other, 'own': match.own, 'playing': match.playing});
	},

	addNewPlayer: function(id, x, y){
		this.ownID = id;
		this.connectedPlayers[id] = 'player' + id;
	},

	removePlayer: function(id){
		console.log("Player with id " + id + " removed");
		delete this.connectedPlayers[id];
	},

});


let SkillGameAirship = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function SkillGameAirship(){
		Phaser.Scene.call(this, { key: 'skillGameAirship' });

		this.gameType = "Luftfahrt";
		this.areaID = 34;
		this.timer = 15;
		this.score = 0;
		this.countdown = 3;		//Sets the time (usually 3 s) in which the player can prepare before the game starts.
		this.minTilt = -30;		//Define the threshold of the range in which the tilt input will have effect on the game controls.
		this.maxTilt = 30;			//Define the threshold of the range in which the tilt input will have effect on the game controls.
		this.sensitivity = 1;		//Value to influence the ratio which translates tilt angle of mobile device to rotation angle of game object.

		this.vehicleAngle = 40;	//Defines the max. angle in which Player A can steer the ship left or right.
		this.inertia = 0.2;		//0.x Factor that delays the execution of the vehicle's controls, to simulate its inertia.
		this.vehicleWinAngle = 3;	//Defines the angle in which Player A has to keep the ship within, to possibly reach win-state. The win-state is only triggered if Player B is within StreamWinAngle.

		this.streamRange = 30;		//Defines the max. angle in which the Player B can veer the Stream's vector.
		this.streamForce = 2;		//Factor with which the force of stream's vector can be adjusted.
		this.streamWinAngle = 3;	//Defines the angle in which Player B has to keep the stream's vector within, to possibly reach win-state. The win-state is only triggered if Player A's ship is within VehicleWinAngle.
	
		this.destabiliser = 0.03;	//0.0x Factor that is multiplied with the time spent within win-state. The closer the product reaches 1, the more Sensitivity will increase, possibly throwing them out of win-state.
	
		//other variables needed
		this.vehiclearrow;
		this.streamArrow;
		this.rotationText;

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
	
		
	},

	preload: function(){
		this.load.image('vehicleArrowLarge', 'assets/EPPSA_Airship_VehicleHUDlarge.png');
		this.load.image('vehicleArrowSmall', 'assets/EPPSA_Airship_VehicleHUDsmall.png');
		this.load.image('windArrowLarge', 'assets/EPPSA_Airship_WindHUDlarge.png');
		this.load.image('windArrowSmall', 'assets/EPPSA_Airship_WindHUDsmall.png');

		this.load.image('wind', 'assets/EPPSA_Airship_Wind.png');
		this.load.image('windDirection', 'assets/EPPSA_Airship_WindDirection.png');


		this.load.image('vehicle', 'assets/EPPSA_Airship_Vehicle.png');

		this.load.image('pointHUD', 'assets/EPPSA_Airship_PointCountHUD.png');
	}, 

	create: function(data){
		//setup gameboard
		//this.timeLeft = this.add.graphics();

		//text for debugging
		this.rotationText = this.add.text(10, 10, 'phaser', {fill: '#000000'});

		if(data.type == 'singleplayer'){
			this.singleplayer = true;
			this.playingShip = true;

			this.windImage = this.add.image(this.width, this.height/2, 'wind').setOrigin(1,1);
			this.windImage.setScale(this.width/this.windImage.width, this.width/this.windImage.width);

			this.vehicleImage = this.add.image(this.width/2, this.height/2 + this.height/6, 'vehicle').setOrigin(0.5, 0).setScale(0.15);

			this.streamArrow = this.add.image(this.width/2,this.height/2 - this.height/8, 'windArrowSmall').setOrigin(0.5,1).setScale(0.2);
			this.vehicleArrow = this.add.image(this.width/2, this.height/2 + 10, 'vehicleArrowLarge').setOrigin(0.5,0).setScale(0.2);

			

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
		
	},

	startMultiplayerGame: function(){
		this.countdownText = this.add.text(this.width/2, this.height/2, this.countdown, {font: '60px Arial', fill: '#000000'});
		this.countdownTimer = this.time.addEvent({delay: 1000, callback: this.countdownFunc, callbackScope: this, repeat: this.countdown});
	},

	update: function(){
		if(this.gameStarted){
			this.lastTimeInWinState = this.currentlyInWinState;
			this.currentlyInWinState = this.checkIfWinState();

			this.vehicle.angle = this.vehicleArrow.angle;
			this.windDirectionLeft.angle = this.streamArrow.angle;
			this.windDirectionRight.angle = this.streamArrow.angle;

			if(!this.lastTimeInWinState && this.currentlyInWinState ){
				console.log("starting Winning counter");
				this.rotationText.setStyle({color: '#ff00ff', fontSize: '50px'});
				this.winStateCounter = this.time.addEvent({delay: 1000, callback: this.increaseWinStateTime, callbackScope: this, loop: true});
			}

			if(this.lastTimeInWinState && !this.currentlyInWinState){
				console.log("stopping Winning counter");
				this.rotationText.setStyle({color: '#ff0000', fontSize: '20px'});
				this.winStateCounter.remove(false);
				this.currentTimeInWinState = 0;
			}		
		}
	},

	increaseWinStateTime: function(){
		console.log('increasing win state time');
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
				console.log('movement detected');
				currentGameScene.handleOrientation(event);
			}
			window.addEventListener("deviceorientation", this.listenerFunc, true);

			if(this.singleplayer){
				this.timedEvent = this.time.addEvent({ delay: 1500, callback: this.onEventRotateSingleplayer, callbackScope: this, loop: true });
			}
		}

	},

	onGameEnd: function(){
		window.removeEventListener("deviceorientation", this.listenerFunc, true);
		this.winStateCounter.remove(false);
		this.gameStarted = false;

		this.rotationText.setText("Game Ended, \n time in winning State " + this.timeInWinState);
		let score = this.timeInWinState * 100;

		gameClient.source.postMessage(
			{
			  source: "challenge",
			  score
			}, gameClient.origin)

	},

	onEventRotateSingleplayer: function(){
		this.streamArrow.angle = Math.random() * (15 - (-14)) + (-15);
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
		this.rotationText.setText("Rotated by " + event.gamma);

		let orientationGamma = event.gamma;
	
		//clamp value of tilt input to minTilt and maxTilt as defined in backend
		orientationGamma = orientationGamma <= that.minTilt ? that.minTilt : orientationGamma >= that.maxTilt ? that.maxTilt : orientationGamma;
		let newRotation = orientationGamma * that.sensitivity;
	
		if(this.playingShip){
			//clamp value of newRotation to vehicleAngle and negative vehicleAngle
			newRotation = newRotation <= -that.vehicleAngle ? -that.vehicleAngle : newRotation >= that.vehicleAngle ? that.vehicleAngle : newRotation;
			//TODO only inertia if player is controlling Airship
			let orientatationEvent = that.time.addEvent({delay: that.inertia * 1000, callback: that.rotateArrow, args: [that.vehicleArrow, newRotation], callbackScope: that});
		}else{
			//clamp value of newRotation to streamRange and negative streamRange
			newRotation = newRotation <= -that.streamRange ? -that.streamRange : newRotation >= that.streamRange ? that.streamRange : newRotation;
			//TODO only inertia if player is controlling Airship
			let orientatationEvent = that.time.addEvent({delay: 0, callback: that.rotateArrow, args: [that.windArrow, newRotation], callbackScope: that});
		}
		
	},

	rotateArrow: function(arrow, newRotation){
		arrow.angle = newRotation;
		console.log('rotating arrow');
		Client.ArrowChange({'rotation': newRotation, 'sender': this.ownID, 'listener': this.opponentID});
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

 

// our game's configuration
let config = {
	type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
	width: window.innerWidth /** window.devicePixelRatio*/, // game width
	height: window.innerHeight /** window.devicePixelRatio*/, // game height
	backgroundColor: "#F2FCFF",
	parent: 'game',
	displayVisibilityChange: true,
	scene: [ MatchmakingLobby, SkillGameAirship ] // our newly created scene
  };

  console.log(window.devicePixelRatio);
   
  // create the game, and pass it the configuration
  let game = new Phaser.Game(config);
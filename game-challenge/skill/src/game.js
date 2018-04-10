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

	},

	create: function(){
		this.welcomeText = this.add.text(10, 10, 'waiting for a second player', {font: '12px Arial', fill: '#000000'});

		//server code
		this.connectedPlayers = {};
		this.ownID = 0;
		Client.askNewPlayer();
	},

	showMatchingStatus: function(info){
		this.welcomeText.setText(info);
	},

	startGameWithMatchedPartner: function(match){
		this.scene.start('skillGameAirship', {'match': match.other, 'own': match.own});
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
		this.timeLeft;

		this.timeInWinState = 0;
		this.currentlyInWinState = false;
		this.lastTimeInWinState = false;
		this.currentTimeInWinState = 0;

		this.width = window.innerWidth ;
		this.height = window.innerHeight ;
	
		
	},

	preload: function(){
		this.load.image('ownArrow', 'assets/arrow.jpg');
		this.load.image('otherArrow', 'assets/other-arrow.jpg');
	}, 

	create: function(data){
		//server code
		console.log('starting a new game with ', data);
		this.ownID = data.own;
		this.opponentID = data.match;
		
		//TODO decide who is wind and who is Airship
		this.streamArrow = this.add.sprite(this.width/2,150, 'otherArrow');
		this.vehicleArrow = this.add.sprite(this.width/2, this.height - 150, 'ownArrow');
		
		//setup gameboard
		var middleLine = new Phaser.Geom.Line(this.width, this.height/2, 0, this.height/2);
		var graphics = this.add.graphics({lineStyle: {width: 4, color: 0xaa0aa}});
		graphics.strokeLineShape(middleLine);

		var thirdLine = new Phaser.Geom.Line(this.width, this.height/3, 0, this.height/3);
		graphics.lineStyle(2, 0xaa0aa, 0.4);
		graphics.strokeLineShape(thirdLine);

		this.timeLeft = this.add.graphics();

		
	
		//text for debugging
		this.rotationText = this.add.text(10, 10, 'phaser', {fill: '#000000'});

		Client.readyToPlay({'own' : this.ownID, 'other': this.opponentID});
	},

	startMultiplayerGame: function(){
		this.countdownText = this.add.text(this.width/2, this.height/2, this.countdown, {font: '60px Arial', fill: '#000000'});
		this.countdownTimer = this.time.addEvent({delay: 1000, callback: this.countdownFunc, callbackScope: this, repeat: this.countdown});
	},

	update: function(){
		if(this.gameStarted){
			this.lastTimeInWinState = this.currentlyInWinState;
			this.currentlyInWinState = this.checkIfWinState();

			if(!this.lastTimeInWinState && this.currentlyInWinState ){
				console.log("starting Winning counter");
				this.rotationText.setStyle({color: '#ff00ff', fontSize: '50px'});
				//this.rotationText.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
				//game.config.backgroundColor = "#ff00ff";
				this.winStateCounter = this.time.addEvent({delay: 1000, callback: this.increaseWinStateTime, callbackScope: this, loop: true});
			}

			if(this.lastTimeInWinState && !this.currentlyInWinState){
				console.log("stopping Winning counter");
				this.rotationText.setStyle({color: '#ff0000', fontSize: '20px'});
				//this.rotationText.setTint(0xff00ff, 0xffffff, 0x00ffff, 0xff0000);
				this.winStateCounter.remove(false);
				this.currentTimeInWinState = 0;
			}

			this.timeLeft.clear();
			this.timeLeft.fillStyle(0x000000, 1);
			var currentWidthMultiplier = 1 - this.gameTimer.getProgress()
			this.timeLeft.fillRect(0,170,300 * currentWidthMultiplier, 60);

			/*if(this.currentTimeInWinState > 0){
				this.sensitivity += 1 - this.destabiliser * this.currentTimeInWinState
			}*/
			
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

			//function to controll the stream if singlePlayer
			//this.timedEvent = this.time.addEvent({ delay: 1500, callback: this.onEventRotate, callbackScope: this, loop: true });
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

	moveOpponentArrow: function(data){
		this.streamArrow.angle = data;
	},

	onEventRotate: function(){
		this.streamArrow.angle = Math.random() * (15 - (-14)) + (-15);
	},

	handleOrientation: function(e){
		let that = this;
		this.rotationText.setText("Rotated by " + event.gamma);

		let orientationGamma = event.gamma;
	
		//clamp value of tilt input to minTilt and maxTilt as defined in backend
		orientationGamma = orientationGamma <= that.minTilt ? that.minTilt : orientationGamma >= that.maxTilt ? that.maxTilt : orientationGamma;
	
		let newRotation = orientationGamma * that.sensitivity;
	
		//clamp value of newRotation to vehicleAngle and negative vehicleAngle
		newRotation = newRotation <= -that.vehicleAngle ? -that.vehicleAngle : newRotation >= that.vehicleAngle ? that.vehicleAngle : newRotation;
	
		//TODO only inertia if player is controlling Airship
		let orientatationEvent = that.time.addEvent({delay: that.inertia * 1000, callback: that.rotateArrow, args: [that.vehicleArrow, newRotation], callbackScope: that})
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
	backgroundColor: "#ffffff",
	parent: 'game',
	displayVisibilityChange: true,
	scene: [ MatchmakingLobby, SkillGameAirship ] // our newly created scene
  };

  console.log(window.devicePixelRatio);
   
  // create the game, and pass it the configuration
  let game = new Phaser.Game(config);
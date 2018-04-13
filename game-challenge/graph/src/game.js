let gameClient;

window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event)
  gameClient = { source: event.source, origin: event.origin }
}


let GraphGame = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function SkillGameAirship(){
		Phaser.Scene.call(this, { key: 'graphGame' });

		//global attributes
		this.gameType = "graph";
		this.areaID = 34;
		this.timer = 30;
		this.score = 0;

		//game specific attributes

		//agentAttributes
		this.agentCounter = 0;				//Counts the number of agents that trigger a win-event (used for score calculation).
		this.spawnInterval = 3;				//Sets the time interval after which the next agent spawns.
		this.maxAgents = 8;					//Defines the max. amount of agents that can be on the board. Spawn is paused while the amount of agents on the board = this value.

		this.agentClasses = availableClasses;
		this.agentSpawnRates = [];
		this.spawnSum = 0;

		//nodeAttributes
		this.nodeCount = 35; 		//Defines the amount nodes for the graph.
		this.nodes = assetsNodes;
	
		//other variables needed
		this.currentAgentsOnBoard = 0;
		this.currentAgents = {};	
		this.currentAgentDistribution = {};	
		this.currentAgentID = 0;

		this.pathSelectionActive = false;
		this.currentPathID = 0;
		this.currentPath = {};

		this.startNodes = [];
		this.spawnedNodes = [];
		//this.lines = {};

		this.graphicsPath = [];
		this.pathCounter = 0;

		//this.width = window.innerWidth;
		//this.height = window.innerHeight;

		this.countedWinEvents = 0;
		this.displayPointsText;
	
		
	},

	preload: function(){
		this.load.image('regular', 'assets/EPPSA_Heinzel_Node.png');
		this.load.image('start', 'assets/EPPSA_Heinzel_Node.png');
		this.load.image('exit', 'assets/EPPSA_Heinzel_Node.png');

		this.load.image('baker', 'assets/EPPSA_Heinzel_HouseBaker.png');
		this.load.image('shoemaker', 'assets/EPPSA_Heinzel_HouseShoemaker.png');
		this.load.image('smith', 'assets/EPPSA_Heinzel_HouseSmith.png');
		this.load.image('tailor', 'assets/EPPSA_Heinzel_HouseTailor.png');

		this.load.image('bakerh', 'assets/EPPSA_Heinzel_BakerMaennchen.png');
		this.load.image('smithh', 'assets/EPPSA_Heinzel_SmithMaennchen.png');
		this.load.image('tailorh', 'assets/EPPSA_Heinzel_TailorMaennchen.png');
		this.load.image('shoemakerh', 'assets/EPPSA_Heinzel_ShoemakerMaennchen.png');
		this.load.image('tailorwife', 'assets/EPPSA_Heinzel_TailorWife.png');
	}, 

	create: function(data){
		var that = this;

		this.drawNodes();

		this.setupAgentSpawnRates();
		

		this.spawnAgentTimer = this.time.addEvent({delay: this.spawnInterval * 1000, callback: this.spawnAgent, callbackScope: this, loop: true});

		this.displayPointsText = this.add.text(350, 550, this.countedWinEvents * 10, {color: '#ff00ff', fontSize: '20px'});

		this.input.on('gameobjectdown', function(pointer, gameObject){
			if(gameObject.name == 'agent'){
				gameObject.timer.remove(false); //stopping autonomous movement
				this.pathSelectionActive = true;
				that.currentPath[that.currentPathID] = {'agent' : gameObject, 'path' : []};
				gameObject.setTint(0xff0000);

				/* Array notation
				that.currentAgents.forEach(function(element){
					if(gameObject == element.img){
						that.currentPath[that.currentPathID].path.push(that.spawnedNodes[element.nodeID]);
					}
				});*/
				for(var agent in that.currentAgents){
					if(gameObject == that.currentAgents[agent].img){
						that.currentPath[that.currentPathID].path.push(that.spawnedNodes[that.currentAgents[agent].nodeID]);
					}
				}

				console.log('current path ', that.currentPath);
			}
		});

		//TODO
		/*
		- look at tweens
		*/
		this.input.on('gameobjectover', function (pointer, gameObject) {
			if(this.pathSelectionActive && gameObject.name == 'node'){
				var pathLength = that.currentPath[that.currentPathID].path.length;
				//check if node is first or is connected to last node in path
				that.spawnedNodes.forEach(function(element){
					if(gameObject == element.img){
						if(pathLength == 0){
							console.log('this should not be logged out');
							that.currentPath[that.currentPathID].path.push(element);
							gameObject.setTint(0xff0000);
						}else{
							var lastElement = that.currentPath[that.currentPathID].path[pathLength-1];
							if(element.connectedTo.indexOf(lastElement.id) != -1){
								middleLine = new Phaser.Geom.Line(that.nodes[lastElement.id].xPosition, that.nodes[lastElement.id].yPosition, that.nodes[element.id].xPosition, that.nodes[element.id].yPosition);
								that.graphicsPath[that.pathCounter] = that.add.graphics({lineStyle: {width: 4, color: 0xff0000}});
								that.graphicsPath[that.pathCounter].strokeLineShape(middleLine);
								that.currentPath[that.currentPathID].path.push(element);
								gameObject.setTint(0xff0000);
								that.pathCounter ++;
							}
						}
					}
				});
			}
		});
	
		//everything related to camera movement
		//set bounds of camera
		this.cameras.main.setBounds(0, 0, 600, 800);
		this.scrolling = false;

		this.input.on('pointerdown', function (pointer) {

			//this.scrolling = true;

		});


		this.input.on('pointermove', function (pointer) {

			if (this.scrolling)
			{
				if (this.origDragPoint) {		
					this.cameras.main.scrollX += this.origDragPoint.x - pointer.position.x;		
					this.cameras.main.scrollY += this.origDragPoint.y - pointer.position.y;	
				}
				this.origDragPoint = pointer.position.clone();
			}
			else {	
				this.origDragPoint = null;
			}
		});
		//endof camera movement

		

		this.input.on('pointerup', function(){
			//this.scrolling = false;
			if(this.pathSelectionActive){
				this.pathSelectionActive = false;
				that.spawnedNodes.forEach(function(element){
					element.img.clearTint();
				});
				/* Array notation
				that.currentAgents.forEach(function(element){
					element.img.clearTint();
				});
				*/
				for (var agent in that.currentAgents){
					that.currentAgents[agent].img.clearTint();
				}
				that.graphicsPath.forEach(function(element){
					element.clear();
				});
				that.graphicsPath = [];
				that.pathCounter = 0;

				that.moveAgentToNextNode(that.currentPath[that.currentPathID].agent, that.currentPath[that.currentPathID].path[1], that.currentPathID);
				that.currentPathID ++;

				console.log('current Paths ', that.currentPath);
				
			}
			
		});
		
		this.gameTimer = this.time.addEvent({delay: 1000 * this.timer, callback: this.onGameEnd, callbackScope: this, startAt: 0 });

	},

	update: function(data){

	},

	moveAgentToNextNode(agent, node, pathID = null){
		//console.log(agent);

		var currentlyMovingAgent;

		for (var a in this.currentAgents){
			if(agent == this.currentAgents[a].img){
				currentlyMovingAgent = this.currentAgents[a];
			}
		}

		//if agent has no path selected, move him randomly
		if(pathID == null){
			var nodeIndex = Math.floor(Math.random() * this.nodes[node.id].connectedTo.length);
			node.id = this.nodes[node.id].connectedTo[nodeIndex];
		}

		agent.tween = this.tweens.add({
			targets: agent,
			x: this.nodes[node.id].xPosition,
			y: this.nodes[node.id].yPosition,
			duration: 1000,
			ease: 'Power2',
			yoyo: false,
			repeat: 0
		});
	

		//agent.x = this.nodes[node.id].xPosition;
		//agent.y = this.nodes[node.id].yPosition;
	
		//adjust agents current nodeID
		/* Array notation
		this.currentAgents.forEach(function(element){
			if(agent == element.img){
				element.nodeID = node.id;
			}
		});
		*/
		console.log(this.spawnedNodes[node.id].agentOnNode);
		if(this.spawnedNodes[node.id].agentOnNode != undefined){
			console.log('Trying to move onto node that already has agent ' + this.spawnedNodes[node.id].agentOnNode);
			if(currentlyMovingAgent.isHostile){
				console.log('destroying agent because of hostile agent');
				this.currentAgents[this.spawnedNodes[node.id].agentOnNode].img.destroy();
			}
			//else 
				//check if agent there is hostile, if yes, destroy self
				//else
					//stop movement of agent that blocks node and send him directly to random neighboring node
		}


		this.spawnedNodes[currentlyMovingAgent.nodeID].agentOnNode = undefined;
		currentlyMovingAgent.nodeID = node.id;
		this.spawnedNodes[node.id].agentOnNode = currentlyMovingAgent.id;
			
		
		
		if(this.nodes[node.id].nodeState == 'exit'){
			//TODO check if can enter
			console.log('agent at exit');
			this.countedWinEvents ++;
			this.displayPointsText.setText(this.countedWinEvents * 10);
			this.currentAgentsOnBoard --;
			//TODO remove from currentAgents
			//TODO adjust distribution
			agent.setVisible(false);
			agent.destroy();
			return null;
		}
	
		if(pathID != null){
			this.currentPath[pathID].path.shift();
			if(this.currentPath[pathID].path[1] != undefined){
				node = this.currentPath[pathID].path[1];
				agent.timer = this.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + this.nodes[node.id].nodePauseTime), callback: this.moveAgentToNextNode, args: [agent, node, pathID], callbackScope: this});
			}else{
				//TODO fix bug that agent at end of defined path jumps one node to far
				var nodeIndex = Math.floor(Math.random() * this.nodes[node.id].connectedTo.length);
				node.id = this.nodes[node.id].connectedTo[nodeIndex];
				agent.timer = this.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + this.nodes[node.id].nodePauseTime), callback: this.moveAgentToNextNode, args: [agent, node], callbackScope: this});
			}
		}else{
			agent.timer = this.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + this.nodes[node.id].nodePauseTime), callback: this.moveAgentToNextNode, args: [agent, node], callbackScope: this});
		}
			
		
	},

	drawNodes: function(){
		var that = this;
		var counter = 0;
		for(var node in this.nodes){
			this.node = {};
			var currentNode = this.nodes[node];
			if(this.nodes[node].nodeState == "start" /*or startExit*/){
				this.startNodes.push({'id': this.nodes[node].nodeID, 'x': this.nodes[node].xPosition, 'y': this.nodes[node].yPosition});
			}
			if(currentNode.skin != ''){
				this.node.img = that.add.sprite(currentNode.xPosition,this.nodes[node].yPosition, currentNode.skin).setInteractive();
			}else{
				this.node.img = that.add.sprite(this.nodes[node].xPosition,this.nodes[node].yPosition, this.nodes[node].nodeState).setInteractive();
			}
			this.node.connectedTo = currentNode.connectedTo;
			this.node.pauseTime = currentNode.nodePauseTime;
			this.node.id = currentNode.nodeID;
			this.node.img.setScale(0.1,0.1).setName('node');

			that.nodes[node].connectedTo.forEach(function(element){
				middleLine = new Phaser.Geom.Line(that.nodes[node].xPosition, that.nodes[node].yPosition, that.nodes[element].xPosition, that.nodes[element].yPosition);
				that.add.text(that.nodes[node].xPosition, that.nodes[node].yPosition, that.nodes[node].nodeID, {fill: '#ffffff'});
				var graphics = that.add.graphics({lineStyle: {width: 4, color: 0xCCD6DF}});
				graphics.strokeLineShape(middleLine);
				//TODO lines should only be drawn once!
				//that.lines[counter] = {'line' : middleLine};
				//counter ++;
			})
			this.spawnedNodes.push(this.node);
			this.node.img.setDepth(1);

			
		}
		//console.log(this.lines);
		console.log('spawned Nodes ', this.spawnedNodes);
	},

	setupAgentSpawnRates: function(){
		for (var agentClass in this.agentClasses){
			this.agentSpawnRates.push(this.agentClasses[agentClass].spawnProbability);
			this.spawnSum += parseFloat(this.agentClasses[agentClass].spawnProbability);
		}
		this.spawnSum = Number.parseFloat(this.spawnSum).toFixed(2);
	},

	getAgentAccordingToSpawnRate: function(list, weight){
		var rand = function(min, max) {
			return Math.random() * (max - min) + min;
		};

		var total_weight = weight.reduce(function(prev, cur, i, arr ){
			return prev + cur;
		});

		var random_num = rand(0, total_weight);
    	var weight_sum = 0;
     
		for (var i = 0; i < list.length; i++) {
			weight_sum += weight[i];
			weight_sum = +weight_sum.toFixed(2);
			
			if (random_num <= weight_sum) {
				return list[i];
			}
		}
	
	},

	spawnAgent: function(){
		//console.log("trying to spawn agent " + this.currentAgentsOnBoard + "/" + this.maxAgents);
		if(this.currentAgentsOnBoard < this.maxAgents){
			//console.log("agent is being spawned");

			//get a random agent type
			var agentType = this.getAgentAccordingToSpawnRate(this.agentClasses, this.agentSpawnRates);
			if(this.currentAgentDistribution[agentType.name] != undefined && this.currentAgentDistribution[agentType.name].value >= agentType.classCap){
				console.log("trying to spawn " + agentType.name + " but cap is reached");
				this.spawnAgent();
				return;
			}

			//adjust current distribution values
			if(this.currentAgentDistribution[agentType.name] == undefined){
				this.currentAgentDistribution[agentType.name] = {'value' : 1 };
			}else{
				this.currentAgentDistribution[agentType.name].value ++;
			}

			var nodeIndex = Math.floor(Math.random() * this.startNodes.length);

			//copying values of selected startNode to now impact the startNode by later changes
			var startNode = {};
			for (var prop in this.startNodes[nodeIndex]){
				startNode[prop] = this.startNodes[nodeIndex][prop];
			}


			var newAgent = {};
			newAgent.img = this.add.image(startNode.x, startNode.y, agentType.name).setInteractive().setName('agent').setDepth(1).setScale(0.1,0.1);
			newAgent.type = agentType.name;
			newAgent.isHostile = agentType.isHostile;
			newAgent.pauseTime = agentType.pauseTime;
			newAgent.nodeID = startNode.id;


			//this.currentAgents.push(newAgent);
			this.currentAgents[this.currentAgentID] = newAgent;
			this.spawnedNodes[startNode.id].agentOnNode = this.currentAgentID;
			this.currentAgentID ++;
			this.currentAgentsOnBoard ++;
		
			//if agent was spawned, start his movement
			this.time.addEvent({delay: 1000, callback: this.moveAgentToNextNode, args: [newAgent.img, startNode], callbackScope: this});
		}
	},

	onGameEnd: function(){
		//TODO redirect back to main game, send final score
		console.log('game over');
		let score = this.countedWinEvents * 10;
		//this.scene.start('gameoverscene', {'score': this.countedWinEvents * 10});
		gameClient.source.postMessage(
			{
			  source: "challenge",
			  score
			}, gameClient.origin)
	}
	
});

let GameOverScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function MatchmakingLobby(){
		Phaser.Scene.call(this, { key: 'gameoverscene' });
	},

	preload: function(){

	},

	create: function(data){
		this.welcomeText = this.add.text(10, 10, data.score, {font: '12px Arial', fill: '#000000'});

	},

});

 

// our game's configuration
let config = {
	type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
	width: 500 * window.devicePixelRatio, // game width
	height:  600 * window.devicePixelRatio, // game height
	backgroundColor: "#18516A",
	parent: 'game',
	displayVisibilityChange: true,
	scene: [ GraphGame, GameOverScene ] // our newly created scene
  };
   
  // create the game, and pass it the configuration
  let game = new Phaser.Game(config);
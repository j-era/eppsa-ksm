//import axios from "axios"

class ContentServer {
  constructor(uri) {
	  console.log(uri);
	this.api = axios.create({ baseURL: uri })
	console.log(this.api);
  }

  getData(branch = "master", path = "") {
	  console.log("getting Data");
    return this.api.get(`/${branch}/content/${path}`).then((response) => response.data)
  }
}


let gameClient;
let gameData;

function transform(content) {
	return Object.assign(_.mapValues(_.omit(content, "index"), transform), content.index)
  }

//window.addEventListener("message", receiveMessage, false)
function receiveMessage(event)
{
  console.log(event)
  gameData = event.data.challenge;
  gameClient = { source: event.source, origin: event.origin }

  init();
}

const contentServerUri = 'https://content-server.barbara.eppsa.de'
const assetServerUri = 'https://asset-server.barbara.eppsa.de'
const staticServerUri = 'https://static.barbara.eppsa.de'

try {
    console.assert(window.parent.origin)

    // We are in the same window

    const url = new URL(window.location)

    const challengeNumber = url.searchParams.get("challengeNumber")
    const challengeType = url.searchParams.get("challengeType")

    if (!challengeNumber || !challengeType) {
      console.error(`Missing query parameters: ${challengeNumber}, ${challengeType}`)
    } else {
      if (!contentServerUri || !assetServerUri || !staticServerUri) {
        console.log(
          `Missing config parameters: ${contentServerUri}, ${assetServerUri}, ${staticServerUri}`
        )
      } else {
		  console.log("getting content");
		const contentServer = new ContentServer(contentServerUri)
		console.log(contentServer);
        contentServer.getData()
          .then((data) => {
            const content = selectContent(transform(data), challengeType, challengeNumber)
			console.log(content)
			gameData = content.challenge;
			init();
		  })
		  
      }
    }
  } catch (e) {
    // We are in another window (iframe)
    window.addEventListener("message", receiveMessage, false)
}

function selectContent(data, challengeType, challengeNumber) {
	const station = data.challenges[challengeNumber]
	const challenge = data.challenges[challengeNumber].challengeTypes[challengeType]
  
	return {
	  color: station.color,
	  shared: data.shared,
	  challenge,
	  staticServerUri
	}
  }

let GraphGame = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function SkillGameAirship(){
		Phaser.Scene.call(this, { key: 'graphGame' });

		//global attributes
		this.gameType = "graph";
		this.areaID = 34;
		this.timer = gameData.timer;
		this.score = 0;

		//game specific attributes

		//agentAttributes
		this.spawnInterval = gameData.spawnInterval;	//Sets the time interval after which the next agent spawns.
		this.maxAgents = gameData.maxAgents; 			//Defines the max. amount of agents that can be on the board. Spawn is paused while the amount of agents on the board = this value.

		this.agentClasses = [];
		for(var key in gameData.agents){
			if(key == "template"){
				continue;
			}
			this.agentClasses.push(gameData.agents[key]);
		}
		console.log(this.agentClasses);

		//nodeAttributes
		this.nodeCount = 35; 		//Defines the amount nodes for the graph.

		this.nodes = {};
		for(var key in gameData.nodes){
			if(key == "template"){
				continue;
			}
			this.nodes[key] = gameData.nodes[key];
			this.nodes[key].connectedTo = JSON.parse(gameData.nodes[key].connectedTo);
		}
		console.log(this.nodes);
		//this.nodes = assetsNodes; 	//currently getting those from other js file, should come from cms
	
		//other variables needed
		this.agentSpawnRates = [];
		//this.spawnSum = 0;

		this.currentAgentsOnBoard = 0;
		this.currentAgents = {};	
		this.currentAgentDistribution = {};	
		this.currentAgentID = 0;

		this.pathSelectionActive = false;
		this.currentPathID = 0;
		this.currentPath = {};

		this.graphicsPath = [];
		this.selectedNodes = [];
		this.pathCounter = 0;

		this.startNodes = [];
		this.spawnedNodes = [];
		this.lines = [];

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.scrolled = false;

		console.log("Width ", this.width);
		console.log("Height ", this.height);

		this.countedWinEvents = 0;
		this.displayPointsText;
	
		
	},

	preload: function(){
		//console.log(gameData.assets);
		for(var key in gameData.assets){
			if(key == "template"){
				continue;
			}
			//console.log(gameData.assets[key].name);
			this.load.image(gameData.assets[key].name, 'https://asset-server.barbara.eppsa.de/' + gameData.assets[key].image.src);
		}
		/*this.load.image('regular', 'assets/EPPSA_Heinzel_Node.png');
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

		this.load.image('button', 'assets/EPPSA_Heinzel_Button.png');
		*/
	}, 

	create: function(data){
		var that = this;

		this.drawNodes();
		this.setupAgentSpawnRates();
		

		this.spawnAgentTimer = this.time.addEvent({delay: this.spawnInterval * 1000, callback: this.spawnAgent, callbackScope: this, startAt: 5, loop: true});

		this.displayPointsText = this.add.text(350, 550, this.countedWinEvents * 10, {color: '#ff00ff', fontSize: '20px'});

		//TODO camera movement depending on screen size
		this.moveRight = this.add.image(this.width - this.width/10, 500, 'button').setScale(0.1, 0.1).setName("right").setInteractive();
		this.moveLeft = this.add.image(2 * this.width - this.width/10, 500, 'button').setScale(0.1, 0.1).setName("left").setInteractive();
		this.moveLeft.flipX = !this.moveLeft.flipX;

		var that = this;

		this.input.on('gameobjectdown', function(pointer, gameObject){
			if(gameObject.name == 'agent'){
				gameObject.timer.remove(false); //stopping autonomous movement
				that.pathSelectionActive = true;
				that.currentPath[that.currentPathID] = {'agent' : gameObject, 'path' : []};
				gameObject.setTint(0xff0000);

				for(var agent in that.currentAgents){
					if(gameObject == that.currentAgents[agent].img){
						that.currentPath[that.currentPathID].path.push(that.spawnedNodes[that.currentAgents[agent].nodeID]);
					}
				}

				console.log('current path ', that.currentPath);
			}else if(gameObject.name == 'right'){
				that.cameras.main.scrollX = that.width;
				this.scrolled = true;
			}else if(gameObject.name == 'left'){
				this.cameras.main.scrollX = 0;
				this.scrolled = false;
			}
		});

		this.input.on('pointermove', function (pointer) {
			if(that.pathSelectionActive){
				let x = pointer.position.x;
				let y = pointer.position.y;
				if(this.scrolled){
					x += that.width;
				}

				console.log("Checking nodes");
				that.spawnedNodes.forEach(function(element){
					if( x - 35 <= element.img.x && element.img.x <= x + 35 && y - 35  <= element.img.y &&  element.img.y <= y + 35){
						console.log("found node " + element.id);
						var pathLength = that.currentPath[that.currentPathID].path.length;
						if(pathLength == 0){
							console.log('this should not be logged out');
							that.currentPath[that.currentPathID].path.push(element);
							element.img.setTint(0xff0000);
						}else{
							var lastElement = that.currentPath[that.currentPathID].path[pathLength-1];
							if(element.connectedTo.indexOf(lastElement.id) != -1){
								let middleLine = new Phaser.Geom.Line(that.xPosToScreen(that.nodes[lastElement.id].xPosition), that.yPosToScreen(that.nodes[lastElement.id].yPosition), that.xPosToScreen(that.nodes[element.id].xPosition), that.yPosToScreen(that.nodes[element.id].yPosition));
								that.graphicsPath[that.pathCounter] = that.add.graphics({lineStyle: {width: 4, color: 0xCCD6DF}});
								that.graphicsPath[that.pathCounter].strokeLineShape(middleLine);
								that.currentPath[that.currentPathID].path.push(element);
								element.img.setTint(0xff0000);
								that.selectedNodes.push(element.id);
								that.pathCounter ++;
							}
						}
					}
				});
			}
		});
	
		this.input.on('pointerup', function(){
			if(that.pathSelectionActive){
				that.pathSelectionActive = false;
				/*that.spawnedNodes.forEach(function(element){
					element.img.clearTint();
				});*/
				that.currentPath[that.currentPathID].agent.selectedNodes = that.selectedNodes;
				for (var agent in that.currentAgents){
					that.currentAgents[agent].img.clearTint();
				}
				/*that.graphicsPath.forEach(function(element){
					element.clear();
				});*/
				that.currentPath[that.currentPathID].agent.graphicsPath = that.graphicsPath;
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
		//console.log(node);
		let nextNode = {};
		//if agent has no path selected, move him randomly
		if(pathID == null){
			var nodeIndex = Math.floor(Math.random() * this.nodes[node.id].connectedTo.length);
			//node.id = this.nodes[node.id].connectedTo[nodeIndex];
			nextNode.id = this.nodes[node.id].connectedTo[nodeIndex];
			nextNode.x = this.xPosToScreen(this.nodes[nextNode.id].xPosition);
			nextNode.y = this.yPosToScreen(this.nodes[nextNode.id].yPosition);
		}else{
			nextNode.id = node.id
			nextNode.x = this.xPosToScreen(this.nodes[node.id].xPosition);
			nextNode.y = this.yPosToScreen(this.nodes[node.id].yPosition);
		}

		var currentlyMovingAgent;
		for (var a in this.currentAgents){
			if(agent == this.currentAgents[a].img){
				currentlyMovingAgent = this.currentAgents[a];
			}
		}

		let that = this;

		agent.tween = this.tweens.add({
			targets: agent,
			x: nextNode.x,
			y: nextNode.y,
			duration: 1000,
			//ease: 'Power2',
			yoyo: false,
			repeat: 0,
			onStart: function(){
				//remove agent from node
				that.spawnedNodes[currentlyMovingAgent.nodeID].agentOnNode = undefined;
			},
			onComplete: function(){
				//set agents node to new node
				currentlyMovingAgent.nodeID = nextNode.id;

				//check if there is an agent on the destination node
				if(that.spawnedNodes[nextNode.id].agentOnNode != undefined){
					//console.log('Trying to move onto node that already has agent ' + that.spawnedNodes[node.id].agentOnNode);
					if(currentlyMovingAgent.isHostile == "true"){
						console.log('destroying agent because of hostile agent');
						that.currentAgents[that.spawnedNodes[nextNode.id].agentOnNode].img.destroy();
					}
					else{
						let otherAgentID = that.spawnedNodes[nextNode.id].agentOnNode;
						if(that.currentAgents[otherAgentID].isHostile == "true"){
							console.log('moved onto hostile agent, was destroyed');
							agent.destroy();
						}
						else{
							//stop movement of agent that blocks node and send him directly to random neighboring node
							console.log('otherAgent has to be moved at node ' + nextNode.id);
							if(that.currentAgents[otherAgentID].img.timer){
								that.currentAgents[otherAgentID].img.timer.remove(false);
							}
							let agentPush = that.currentAgents[otherAgentID].img;

							console.log(node);
							that.moveAgentToNextNode(that.currentAgents[otherAgentID].img, nextNode);
							//TODO maybe delete his path?
						}
							
					}
						
				}
				that.spawnedNodes[nextNode.id].agentOnNode = currentlyMovingAgent.id;

				if(that.nodes[nextNode.id].nodeState == 'exit'){
					//TODO check if can enter
					console.log('agent at exit');
					that.countedWinEvents ++;
					that.displayPointsText.setText(that.countedWinEvents * 10);
					that.currentAgentsOnBoard --;
					//TODO remove from currentAgents
					//TODO adjust distribution
					that.tweens.add({
						targets: agent,
						alpha: 0,
						duration: 1000,
						ease: 'Power2',
						yoyo: false,
						repeat: 0,
						onComplete: function(){
							agent.destroy();
						}
					});
					
					return null;
				}

				if(pathID != null){
					that.currentPath[pathID].path.shift();
					if(that.currentPath[pathID].path[1] != undefined){
						node = that.currentPath[pathID].path[1];
						agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [agent, node, pathID], callbackScope: that});
					}else{
						//TODO fix bug that agent at end of defined path jumps one node to far
						var nodeIndex = Math.floor(Math.random() * that.nodes[node.id].connectedTo.length);
						//node.id = that.nodes[node.id].connectedTo[nodeIndex];
						nextNode.id = that.nodes[nextNode.id].connectedTo[nodeIndex];
						nextNode.x = that.nodes[nextNode.id].xPosition;
						nextNode.y = that.nodes[nextNode.id].yPosition;

						agent.selectedNodes.forEach(function(element){
							that.spawnedNodes.forEach(function(nodeElement){
								if(nodeElement.id == element){
									nodeElement.img.clearTint();
								}
							})
							
						});
						agent.graphicsPath.forEach(function(element){
							element.clear();
						});

						agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [agent, node], callbackScope: that});
					}
				}else{
					agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [agent, nextNode], callbackScope: that});
				}
				
			}
		});
			
	},

	drawNodes: function(){
		var that = this;
		var counter = 0;
		for(var node in this.nodes){
			this.node = {};
			var currentNode = this.nodes[node];
			if(this.nodes[node].nodeState == "start" /*or startExit*/){
				this.startNodes.push({'id': this.nodes[node].nodeID, 'x': this.xPosToScreen(this.nodes[node].xPosition), 'y': this.yPosToScreen(this.nodes[node].yPosition)});
			}
			if(currentNode.skin != ''){
				this.node.img = that.add.sprite(this.xPosToScreen(currentNode.xPosition),this.yPosToScreen(currentNode.yPosition), currentNode.skin).setInteractive();
				this.node.img.setScale(this.width * window.devicePixelRatio/this.node.img.width * 0.1)
			}else{
				this.node.img = that.add.sprite(this.xPosToScreen(currentNode.xPosition),this.yPosToScreen(currentNode.yPosition), currentNode.nodeState).setInteractive();
				this.node.img.setScale(this.width * window.devicePixelRatio/this.node.img.width * 0.008)
				//console.log(this.xPosToScreen(currentNode.xPosition), this.yPosToScreen(currentNode.yPosition));
			}
			this.node.connectedTo = currentNode.connectedTo;
			this.node.pauseTime = currentNode.nodePauseTime;
			this.node.id = currentNode.nodeID;
			this.node.img.setName('node');

			that.add.text(this.xPosToScreen(currentNode.xPosition), this.yPosToScreen(currentNode.yPosition), that.nodes[node].nodeID, {fill: '#ffffff'});

			that.nodes[node].connectedTo.forEach(function(element){
				let lineTemp = {};
				lineTemp.pos1x = that.nodes[node].xPosition;
				lineTemp.pos1y = that.nodes[node].yPosition;
				lineTemp.pos2x = that.nodes[element].xPosition;
				lineTemp.pos2y = that.nodes[element].yPosition;

				if(that.lines.length == 0){
						var graphics = that.add.graphics({fillStyle: {color: 0xCCD6DF}});
						let middleLine = new Phaser.Geom.Line(that.xPosToScreen(that.nodes[node].xPosition), that.yPosToScreen(that.nodes[node].yPosition), that.xPosToScreen(that.nodes[element].xPosition), that.yPosToScreen(that.nodes[element].yPosition));

						var length = Phaser.Geom.Line.Length(middleLine);
						var points = middleLine.getPoints(length/10);

						for (var i = 0; i < points.length; i++)
						{
							var p = points[i];
							graphics.fillCircle(p.x - 1, p.y - 1, 2);
						}
						that.lines.push(lineTemp);
				}else{
					let insert = true;
					that.lines.forEach(function(lineElement){
						if(lineElement.pos1x == lineTemp.pos2x && lineElement.pos1y == lineTemp.pos2y && lineElement.pos2x == lineTemp.pos1x && lineElement.pos2y == lineTemp.pos1y){
							insert = false;
						}
					});
					if(insert){
						var graphics = that.add.graphics({fillStyle: {color: 0xCCD6DF}});
							let middleLine = new Phaser.Geom.Line(that.xPosToScreen(that.nodes[node].xPosition), that.yPosToScreen(that.nodes[node].yPosition), that.xPosToScreen(that.nodes[element].xPosition), that.yPosToScreen(that.nodes[element].yPosition));
	
							var length = Phaser.Geom.Line.Length(middleLine);
							var points = middleLine.getPoints(length/10);
	
							for (var i = 0; i < points.length; i++)
							{
								var p = points[i];
								graphics.fillCircle(p.x - 1, p.y - 1, 2);
							}
						that.lines.push(lineTemp);
					}
				}
			})
			this.spawnedNodes.push(this.node);
			this.node.img.setDepth(1);	
		}
		console.log('spawned Nodes ', this.spawnedNodes);
	},

	setupAgentSpawnRates: function(){
		for (var agentClass in this.agentClasses){
			this.agentSpawnRates.push(this.agentClasses[agentClass].spawnProbability);
			//this.spawnSum += parseFloat(this.agentClasses[agentClass].spawnProbability);
		}
		//this.spawnSum = Number.parseFloat(this.spawnSum).toFixed(2);
	},

	xPosToScreen: function(pos){
		return this.width * pos/100;
	},

	yPosToScreen: function(pos){
		return this.height * pos/100;
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

			//copying values of selected startNode to not impact the startNode by later changes
			var startNode = {};
			for (var prop in this.startNodes[nodeIndex]){
				startNode[prop] = this.startNodes[nodeIndex][prop];
			}


			var newAgent = {};
			newAgent.img = this.add.image(startNode.x, startNode.y, agentType.name).setInteractive().setName('agent').setDepth(1).setAlpha(0).setOrigin(0.5,0.5);
			newAgent.img.setScale(this.width/newAgent.img.width * 0.08);
			newAgent.type = agentType.name;
			newAgent.id = this.currentAgentID;
			newAgent.isHostile = agentType.isHostile;
			newAgent.pauseTime = agentType.pauseTime;
			newAgent.nodeID = startNode.id;

			this.tweens.add({
				targets: newAgent.img,
				alpha: 1,
				duration: 1000,
				ease: 'Power2',
				yoyo: false,
				repeat: 0,
			});

			this.currentAgents[this.currentAgentID] = newAgent;
			this.spawnedNodes[startNode.id].agentOnNode = this.currentAgentID;
			this.currentAgentID ++;
			this.currentAgentsOnBoard ++;
		
			//if agent was spawned, start his movement
			newAgent.img.timer = this.time.addEvent({delay: 1000, callback: this.moveAgentToNextNode, args: [newAgent.img, startNode], callbackScope: this});
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
	width: window.innerWidth * window.devicePixelRatio, // game width
	height:  window.innerHeight * window.devicePixelRatio, // game height
	backgroundColor: "#18516A",
	parent: 'game',
	displayVisibilityChange: true,
	scene: [ GraphGame, GameOverScene ] // our newly created scene
  };

  let game;

  let init = function(){
	// create the game, and pass it the configuration
	game = new Phaser.Game(config);
  }
   
  

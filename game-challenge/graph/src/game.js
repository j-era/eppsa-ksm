import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"
import Phaser from "./phaser.min"

let gameData;
let gameCallbacks;
let shared;
let color;

bootstrap((data, callbacks) => {
	console.log(data, callbacks);
	gameData = data.challenge;
	gameCallbacks = callbacks.callbacks;
	shared = data.shared;
	color = data.color;
	init();
  })

let GraphGame = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function GraphGame(){
		Phaser.Scene.call(this, { key: 'graphGame' });

		//global attributes
		//this.gameType = "graph";
		//this.areaID = 34;
		this.timer = gameData.timer;
		//this.score = 0;

		//game specific attributes

		//agentAttributes
		this.spawnInterval = gameData.spawnInterval;	//Sets the time interval after which the next agent spawns.
		this.maxAgents = gameData.maxAgents; 			//Defines the max. amount of agents that can be on the board. Spawn is paused while the amount of agents on the board = this value.

		this.agentClasses = [];
		for(var key in gameData.agents){
			if(key == "template"){
				continue;
			}
			gameData.agents[key].assignedDestination = JSON.parse(gameData.agents[key].assignedDestination);
			this.agentClasses.push(gameData.agents[key]);
		}
		console.log(this.agentClasses);

		//nodeAttributes
		this.nodes = {};
		for(var key in gameData.nodes){
			if(key == "template"){
				continue;
			}
			this.nodes[key] = gameData.nodes[key];
			this.nodes[key].connectedTo = JSON.parse(gameData.nodes[key].connectedTo);
		}
		//console.log(this.nodes);

		this.controllPoints = {};
		for(var key in gameData.controlpoints){
			if(key == "template"){
				continue;
			}
			this.controllPoints[key] = gameData.controlpoints[key];
		}
		//console.log("controlPoints" ,this.controllPoints);

		//other variables needed
		this.agentSpawnRates = [];

		this.currentAgentsOnBoard = 0;
		this.currentAgents = {};
		this.currentAgentDistribution = {};
		this.currentAgentID = 0;

		this.agentCounter = 0;

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

		this.countedWinEvents = 0;

		this.lineColor = gameData.lineColor;
		this.pathColor = gameData.pathColor;
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
		var that = this;

		if(gameData.backgroundImage){
			let background = this.add.image(0, 0, gameData.backgroundImage).setOrigin(0,0);
			background.setScale(this.width / background.width, this.height / background.height);
		}

		this.drawNodes();
		this.setupAgentSpawnRates();
		this.spawnAgent();

		if(gameData.showScrollButton == "true"){
			this.moveRight = this.add.image(this.width - this.width/10, this.height - this.height/20, 'button').setName("right").setInteractive();
			this.moveRight.setScale(this.width/this.moveRight.width * 0.15);
		}

		this.input.on('gameobjectdown', function(pointer, gameObject){
			if(gameObject.name == 'agent'){
				gameObject.timer.remove(false); //stopping autonomous movement
				if(gameObject.tween){
					gameObject.tween.stop();
				}

				gameObject.selected = true;

				that.removePathVisuals(gameObject);

				that.pathSelectionActive = true;
				that.currentPath[that.currentPathID] = {'agent' : gameObject, 'path' : []};

				gameObject.selectedTween = that.tweens.add({
					targets: gameObject,
					alpha: 0.5,
					duration: 500,
					yoyo: true,
					repeat: -1,
				});
				gameObject.setTint(0xff0000);

				//push current nodeID into path
				for(var agent in that.currentAgents){
					if(gameObject == that.currentAgents[agent].img){
						console.log(that.spawnedNodes[that.currentAgents[agent].nodeID]);
						that.currentPath[that.currentPathID].path.push(that.spawnedNodes[that.currentAgents[agent].nodeID]);
					}
				}


			}else if(gameObject.name == 'right'){
				gameObject.name = "left";
				gameObject.flipX = !gameObject.flipX;
				that.cameras.main.scrollX = that.width - that.width/5;
				this.scrolled = true;
			}else if(gameObject.name == 'left'){
				gameObject.name = "right";
				gameObject.flipX = !gameObject.flipX;
				this.cameras.main.scrollX = 0;
				this.scrolled = false;
			}
		});

		this.input.on('pointermove', function (pointer) {
			if(that.pathSelectionActive){
				let x = pointer.position.x;
				let y = pointer.position.y;
				if(this.scrolled){
					x += that.width - that.width/5;
				}

				//console.log("Checking nodes");
				that.spawnedNodes.forEach(function(element){
					let dpr = 1;
					//console.log("dpr", window.devicePixelRatio);
					if(window.devicePixelRatio != 1){
						dpr = window.devicePixelRatio;
					}
					let radius = gameData.edgeThreshold + dpr;
					//console.log(radius);
					if( x - radius <= element.img.x && element.img.x <= x + radius && y - radius  <= element.img.y &&  element.img.y <= y + radius){
						//console.log("found node " + element.id);
						var pathLength = that.currentPath[that.currentPathID].path.length;
						if(pathLength == 0){
							console.log('this should not be logged out');
							that.currentPath[that.currentPathID].path.push(element);
						}else{
							var lastElement = that.currentPath[that.currentPathID].path[pathLength-1];
							if(element.connectedTo.indexOf(lastElement.id) != -1){
								let middleLine = new Phaser.Geom.Line(that.xPosToScreen(that.nodes[lastElement.id].xPosition), that.yPosToScreen(that.nodes[lastElement.id].yPosition), that.xPosToScreen(that.nodes[element.id].xPosition), that.yPosToScreen(that.nodes[element.id].yPosition));
								that.graphicsPath[that.pathCounter] = that.add.graphics({lineStyle: {width: that.xPosToScreen(1), color: that.pathColor}});
								that.graphicsPath[that.pathCounter].strokeLineShape(middleLine);
								that.currentPath[that.currentPathID].path.push(element);
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

					if(that.currentAgents[agent].img.selectedTween){
						that.currentAgents[agent].img.selectedTween.stop();
						that.currentAgents[agent].img.alpha = 1;
					}
				}
				/*that.graphicsPath.forEach(function(element){
					element.clear();
				});*/
				that.currentPath[that.currentPathID].agent.selected = false;
				that.currentPath[that.currentPathID].agent.graphicsPath = that.graphicsPath;
				that.graphicsPath = [];
				that.pathCounter = 0;

				if(that.currentPath[that.currentPathID].path[1] != undefined){
					that.currentPath[that.currentPathID].agent.path = that.currentPath[that.currentPathID];
					that.moveAgentToNextNode(that.currentPath[that.currentPathID].agent, that.currentPath[that.currentPathID].path[0], that.currentPathID);
				}else{
					let agent = that.currentPath[that.currentPathID].agent;
					let node = that.currentPath[that.currentPathID].path[0];
					that.currentPath[that.currentPathID].agent.timer = that.time.addEvent({delay: 1000, callback: that.moveAgentToNextNode, args: [agent, node], callbackScope: that});
				}
				that.currentPathID ++;
			}

		});

		gameCallbacks.showTimeline(this.timer);
		gameCallbacks.startTimelineClock();
		this.gameTimer = this.time.addEvent({delay: 1000 * this.timer, callback: this.onGameEnd, callbackScope: this, startAt: 0 });

	},

	moveAgentToNextNode(agent, node, pathID = null){
		let that = this;
		//console.log(agent.id);
		//console.log("node to move to",node);
		let nextNode = {};
		//if agent has no path selected, move him randomly
		if(pathID == null){
			var nodeIndex = Math.floor(Math.random() * this.nodes[node.id].connectedTo.length);
			nextNode.id = this.nodes[node.id].connectedTo[nodeIndex];
			nextNode.x = this.xPosToScreen(this.nodes[nextNode.id].xPosition);
			nextNode.y = this.yPosToScreen(this.nodes[nextNode.id].yPosition);
		}else{
			nextNode.id = this.currentPath[pathID].path[1].id;
			nextNode.x = this.xPosToScreen(this.nodes[nextNode.id].xPosition);
			nextNode.y = this.yPosToScreen(this.nodes[nextNode.id].yPosition);
		}

		var currentlyMovingAgent;
		for (var ag in this.currentAgents){
			if(agent.id == this.currentAgents[ag].id){
				currentlyMovingAgent = this.currentAgents[ag];
				break;
			}
		}
		if(currentlyMovingAgent == undefined){
			return;
		}

		if(that.nodes[nextNode.id].nodeState == 'exit' && currentlyMovingAgent.assignedDestination.indexOf(nextNode.id) == -1){
			that.tweens.add({
				targets: currentlyMovingAgent.img,
				x: currentlyMovingAgent.img.x +10,
				duration: 200,
				yoyo: true,
				repeat: 2,
			});
			console.log("agent can't enter here");
			if(pathID != null){
				currentlyMovingAgent.img.selectedNodes.forEach(function(element){
					that.spawnedNodes.forEach(function(nodeElement){
						if(nodeElement.id == element){
							nodeElement.img.clearTint();
						}
					})
				});
				currentlyMovingAgent.img.graphicsPath.forEach(function(element){
					element.clear();
				});
			}
			agent.lastNode = node;
			currentlyMovingAgent.img.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [currentlyMovingAgent.img, node], callbackScope: that});
			return;
		}

		let offsetX = 0;
		let offsetY = 0;
		let controlPoint = that.checkWaitTime(node.id, nextNode.id);

		if(gameData.rotateAgents == "true"){
			if(node.x == undefined){
				node.x = this.xPosToScreen(this.nodes[node.id].xPosition);
				node.y = this.yPosToScreen(this.nodes[node.id].yPosition);
			}
			if(Math.floor(node.x) != Math.floor(nextNode.x)){
				Math.floor(node.x) > Math.floor(nextNode.x) ? agent.nextDirection = "left" : agent.nextDirection = "right";
				if(controlPoint){
					if(controlPoint.waitTime != undefined){
						offsetX = this.xPosToScreen(-5);
					}
				}
				
			}
			if(Math.floor(node.y) != Math.floor(nextNode.y)){
				Math.floor(node.y) > Math.floor(nextNode.y) ? agent.nextDirection = "up" : agent.nextDirection = "down";
				if(controlPoint){
					if(controlPoint.waitTime != undefined){
						offsetY = this.yPosToScreen(5);
					}
				}
			}
			that.changeDirection(agent);
		}
		
		

		let check = that.checkControlPoint(agent.lastNode.id, node.id, nextNode.id);

		if(check == "crash"){
			that.spawnedNodes[currentlyMovingAgent.nodeID].agentOnNode = undefined;
			//start movement
			/*agent.tween = this.tweens.add({
				targets: agent,
				x: nextNode.x,
				y: nextNode.y,
				duration: 2000,
				yoyo: false,
				repeat: 0,
			});*/
			that.animateCrash(agent, nextNode);
			//delete after half of duration
			//that.time.addEvent({delay: 500, callback: that.destroyAgent, args: [currentlyMovingAgent.id], callbackScope: that});
			//that.destroyAgent(currentlyMovingAgent.id);
			return;
		}

		let a = agent.x - nextNode.x;
		let b = agent.y - nextNode.y;
		let distance = Math.sqrt(a*a + b*b);

		agent.tween = this.tweens.add({
			targets: agent,
			x: nextNode.x + offsetX,
			y: nextNode.y + offsetY,
			duration: distance * currentlyMovingAgent.speed,
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
				if(gameData.collisionOnNode == "true" && that.spawnedNodes[nextNode.id].agentOnNode != undefined){
					//console.log('Trying to move onto node that already has agent ' + that.spawnedNodes[node.id].agentOnNode);
					if(currentlyMovingAgent.isHostile == "true"){
						console.log('destroying agent because of hostile agent');
						that.destroyAgent(that.currentAgents[that.spawnedNodes[nextNode.id].agentOnNode].id);
						//that.currentAgents[that.spawnedNodes[nextNode.id].agentOnNode].img.destroy();
					}
					else{
						let otherAgentID = that.spawnedNodes[nextNode.id].agentOnNode;
						if(that.currentAgents[otherAgentID].isHostile == "true"){
							console.log('moved onto hostile agent, was destroyed');
							that.destroyAgent(currentlyMovingAgent.id);
							return;
						}
						else{
							//stop movement of agent that blocks node and send him directly to random neighboring node
							console.log('otherAgent has to be moved at node ' + nextNode.id);
							if(that.currentAgents[otherAgentID].img.timer){
								that.currentAgents[otherAgentID].img.timer.remove(false);
							}
							if(that.currentAgents[otherAgentID].img.tween){
								that.currentAgents[otherAgentID].img.tween.stop();
							}
							if(that.currentAgents[otherAgentID].img.selected){
								that.pathSelectionActive = false;

								that.currentAgents[otherAgentID].img.selectedTween.stop();
								that.currentAgents[otherAgentID].img.alpha = 1;

								that.graphicsPath.forEach(function(element){
									element.clear();
								});
								that.currentPath[that.currentPathID].agent.selected = false;
								that.graphicsPath = [];
								that.pathCounter = 0;
								that.currentPathID ++;

							}
							if(that.currentAgents[otherAgentID].img.graphicsPath){
								that.removePathVisuals(that.currentAgents[otherAgentID].img);
							}
							let agentPush = that.currentAgents[otherAgentID].img;
							agentPush.lastNode = node;
							that.moveAgentToNextNode(agentPush, nextNode);
						}

					}

				}
				that.spawnedNodes[nextNode.id].agentOnNode = currentlyMovingAgent.id;

				if(that.nodes[nextNode.id].nodeState == 'exit'){
					that.spawnedNodes[nextNode.id].agentOnNode = undefined;
					console.log('agent at exit');
					that.countedWinEvents ++;
					that.destroyAgent(currentlyMovingAgent.id);
					return null;
				}

				/*if(that.nodes[nextNode.id].nodePauseTime && that.nodes[nextNode.id].nodePauseTime != 0){
					that.nodes[nextNode.id].timer = that.time.addEvent({delay: 1000 * that.nodes[nextNode.id].nodePauseTime, callback: that.rotateImage, args: [nextNode.id], callbackScope: that});
				}*/
				//let controlPoint = that.checkWaitTime(node.id, nextNode.id);
				let additionalWaiting = 0;

				if(controlPoint){
					if(controlPoint.waitTime != undefined){
						additionalWaiting = controlPoint.waitTime;
					}
					that.time.addEvent({delay: 1000 * additionalWaiting, callback: that.rotateImage, args: [controlPoint.image, controlPoint.degree], callbackScope: that});
				}

				if(pathID != null){
					that.currentPath[pathID].path.shift();
					if(that.currentPath[pathID].path[1] != undefined){
						//node = that.currentPath[pathID].path[1];
						//node = nextNode;
						agent.lastNode = node;
						agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime + additionalWaiting), callback: that.moveAgentToNextNode, args: [agent, nextNode, pathID], callbackScope: that});
					}else{
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
						agent.lastNode = node;
						agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime + additionalWaiting), callback: that.moveAgentToNextNode, args: [agent, nextNode], callbackScope: that});
					}
				}else{
					agent.lastNode = node;
					agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime + additionalWaiting), callback: that.moveAgentToNextNode, args: [agent, nextNode], callbackScope: that});
				}

			}
		});

	},

	changeDirection: function(agent){
		if(!agent.currentDirection){
			agent.currentDirection = agent.nextDirection;
			switch(agent.nextDirection){
				case "up":
					agent.angle = 0;
					break
				case "down":
					agent.angle = 180;
					break;
				case "left":
					agent.angle = 270;
					break;
				case "right":
					agent.angle = 90;
					break;
				default:
					changeToStraigt(agent);
			}
		}
		else{
			if(agent.currentDirection == "up"){
				switch(agent.nextDirection){
					case "up":
						break
					case "down":
						this.makeUTurn(agent);
						break;
					case "left":
						this.turnLeft(agent);
						break;
					case "right":
						this.turnRight(agent);
						break;
				}
			}else if(agent.currentDirection == "down"){
				switch(agent.nextDirection){
					case "up":
						this.makeUTurn(agent);
						break
					case "down":
						break;
					case "left":
						this.turnRight(agent);
						break;
					case "right":
						this.turnLeft(agent);
						break;
				}
			}else if(agent.currentDirection == "right"){
				switch(agent.nextDirection){
					case "up":
						this.turnLeft(agent);
						break
					case "down":
						this.turnRight(agent);
						break;
					case "left":
						this.makeUTurn(agent);
						break;
					case "right":
						break;
				}
			}else if(agent.currentDirection == "left"){
				switch(agent.nextDirection){
					case "up":
						this.turnRight(agent);
						break
					case "down":
						this.turnLeft(agent);
						break;
					case "left":
						break;
					case "right":
						this.makeUTurn(agent);
						break;
				}
			}
		}
		agent.currentDirection = agent.nextDirection;
	},

	makeUTurn: function(agent){
		this.tweens.add({
			targets: agent,
				angle: agent.angle - 180,
				duration: 300,
				yoyo: false,
				repeat: 0,
		})
	},

	turnLeft: function(agent){
		this.tweens.add({
			targets: agent,
				angle: agent.angle - 90,
				duration: 100,
				yoyo: false,
				repeat: 0,
		})
	},

	turnRight: function(agent){
		this.tweens.add({
			targets: agent,
				angle: agent.angle + 90,
				duration: 100,
				yoyo: false,
				repeat: 0,
		})
	},

	animateCrash: function(agent, node){
		let a = agent.x - node.x;
		let b = agent.y - node.y;

		//agent movement
		agent.tween = this.tweens.add({
			targets: agent,
			x: agent.x - a/1.6,
			y: agent.y - b/1.6,
			duration: 1000,
			yoyo: false,
			repeat: 0,
			onComplete: function(){
				var crashedCar2 = that.add.image(agent.x, agent.y, "redCarCrashed").setOrigin(gameData.agentOriginX, gameData.agentOriginY);
				crashedCar2.setScale(that.height/crashedCar2.height * 0.1);
				crashedCar2.angle = agent.angle;
				that.fadeAndDestroy(crashedCar2);

				that.destroyAgent(agent.id);
			}
		});

		var crashCar = this.add.image(node.x, node.y, "crashCar").setOrigin(1 - gameData.agentOriginX, gameData.agentOriginY);
		crashCar.setScale(this.height/crashCar.height * 0.1);
		switch (agent.currentDirection){
			case "up":
				crashCar.angle = 180;
				break;
			case "down":
				crashCar.angle = 0;
				break;
			case "right":
				crashCar.angle = 270;
				break;
			case "left":
				crashCar.angle = 90;
				break;
		}

		var that = this;

		this.tweens.add({
			targets: crashCar,
			x: node.x + a/1.6,
			y: node.y + b/1.6,
			duration: 1000,
			yoyo: false,
			repeat: 0,
			onComplete: function(){
				var crashedCar1 = that.add.image(crashCar.x, crashCar.y, "redCarCrashed").setOrigin(1 - gameData.agentOriginX, gameData.agentOriginY);
				crashedCar1.setScale(that.height/crashedCar1.height * 0.1);
				crashedCar1.angle = crashCar.angle;
				that.fadeAndDestroy(crashedCar1);
				
				crashCar.destroy();
				crashCar = null;
			}
		})

	},

	fadeAndDestroy: function(image){
		this.tweens.add({
			targets: image,
			a: 0,
			duration: 200,
			yoyo: false,
			repeat: 0,
			onComplete: function(){
				image.destroy();
				image = null;
			}
		})
	},

	calculateScore: function(){
		return gameData.score.reward * this.countedWinEvents * shared.config.graphScoreFactor;
	},

	checkWaitTime: function(current, next){
		if(this.controllPoints[next]){
			let point = this.controllPoints[next][current];
			if(point){
				if(point.skin != ""){
					let xPos = this.nodes[next].xPosition + (this.nodes[next].xPosition - this.nodes[current].xPosition >= 0 ? -5 : 5);
					let yPos = this.nodes[next].yPosition + (this.nodes[next].yPosition - this.nodes[current].yPosition >= 0 ? -5 : 5);
					let pointImage = this.add.image(this.xPosToScreen(xPos), this.yPosToScreen(yPos), point.skin).setOrigin(0.5);
					pointImage.setScale(this.height/pointImage.height * 0.1);
					pointImage.angle = point.rotationWaiting;
					return {'waitTime': point.waitTime, 'image': pointImage, 'degree': point.rotationWaiting};
				}
			}
		}
	},

	checkControlPoint: function(last,current, next){
		if(this.controllPoints[current]){
			let point = this.controllPoints[current][last];
			if(point){
				if(point.crashIf.indexOf(next) != -1){
					console.log("crash");
					return "crash";
				}
				if(point.pointsIf.indexOf(next) != -1){
					this.countedWinEvents ++;
					console.log("points");
					return "points";
				}
			}
		}
		return "";
	},

	rotateImage: function(image, degree){
		image.angle = degree == 90 ? 0 : -90;

		this.tweens.add({
			targets: image,
			alpha: 0,
			duration: 1000,
			yoyo: false,
			repeat: 0,
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
				this.node.img.setScale(this.height/this.node.img.height * 0.3)
			}else{
				this.node.img = that.add.sprite(this.xPosToScreen(currentNode.xPosition),this.yPosToScreen(currentNode.yPosition), currentNode.nodeState).setInteractive();
				this.node.img.setScale(this.height/this.node.img.height * 0.03)
			}
			this.node.connectedTo = currentNode.connectedTo;
			this.node.pauseTime = currentNode.nodePauseTime;
			console.log(currentNode.edgeThreshold);
			this.node.edgeThreshold = currentNode.edgeThreshold;
			this.node.id = currentNode.nodeID;
			this.node.img.setName('node');
			if(gameData.drawLinesAndNodes != "true"){
				this.node.img.setAlpha(0);
			}

			if(gameData.designModeOn == "true"){
				that.add.text(this.xPosToScreen(currentNode.xPosition), this.yPosToScreen(currentNode.yPosition), that.nodes[node].nodeID, {fill: '#ffffff'});
			}

			/*let controllPoint = this.controllPoints[currentNode.nodeID];
			if(controllPoint && controllPoint.skin != ''){
				console.log(currentNode.nodeID);
				controllPoint.image = that.add.image(this.xPosToScreen(currentNode.xPosition), this.yPosToScreen(currentNode.yPosition), controllPoint.skin).setOrigin(0.5).setScale(0.2);
			}*/

			if(gameData.drawLinesAndNodes == "true"){
				that.nodes[node].connectedTo.forEach(function(element){
					let lineTemp = {};
					lineTemp.pos1x = that.nodes[node].xPosition;
					lineTemp.pos1y = that.nodes[node].yPosition;
					lineTemp.pos2x = that.nodes[element].xPosition;
					lineTemp.pos2y = that.nodes[element].yPosition;

					if(that.lines.length == 0){
							var graphics = that.add.graphics({fillStyle: {color: that.lineColor}});
							let middleLine = new Phaser.Geom.Line(that.xPosToScreen(that.nodes[node].xPosition), that.yPosToScreen(that.nodes[node].yPosition), that.xPosToScreen(that.nodes[element].xPosition), that.yPosToScreen(that.nodes[element].yPosition));

							var length = Phaser.Geom.Line.Length(middleLine);
							var points = middleLine.getPoints(length/12);

							for (var i = 0; i < points.length; i++)
							{
								var p = points[i];
								graphics.fillCircle(p.x - 1, p.y - 1, that.xPosToScreen(1));
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
							var graphics = that.add.graphics({fillStyle: {color: that.lineColor}});
							let middleLine = new Phaser.Geom.Line(that.xPosToScreen(that.nodes[node].xPosition), that.yPosToScreen(that.nodes[node].yPosition), that.xPosToScreen(that.nodes[element].xPosition), that.yPosToScreen(that.nodes[element].yPosition));

							var length = Phaser.Geom.Line.Length(middleLine);
							var points = middleLine.getPoints(length/12);

							for (var i = 0; i < points.length; i++)
							{
								var p = points[i];
								graphics.fillCircle(p.x - 1, p.y - 1, that.xPosToScreen(1));
							}
							that.lines.push(lineTemp);
						}
					}
				});
			}

			this.spawnedNodes.push(this.node);
			this.node.img.setDepth(1);
		}
		console.log('spawned Nodes ', this.spawnedNodes);
	},

	setupAgentSpawnRates: function(){
		for (var agentClass in this.agentClasses){
			this.agentSpawnRates.push(this.agentClasses[agentClass].spawnProbability);
		}
	},

	xPosToScreen: function(pos){
		if(gameData.showScrollButton == "true"){
			return (this.width - this.width/10) * pos/100
		}else{
			return this.width * pos/100;
		}
		
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

	removePathVisuals: function(agent){
		var that = this;

		if(agent.selectedNodes){
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
		}

	},

	destroyAgent: function(agentID){
		console.log(agentID);
		let that = this;
		let agent = this.currentAgents[agentID];
		this.currentAgentsOnBoard --;

		this.currentAgentDistribution[agent.name].value --;

		agent.img.timer.paused = true;
		agent.img.timer.remove(false);
		if(agent.img.tween){
			agent.img.tween.stop();
		}

		if(agent.img.selectedNodes != undefined){
			agent.img.selectedNodes.forEach(function(element){
				that.spawnedNodes.forEach(function(nodeElement){
					if(nodeElement.id == element){
						nodeElement.img.clearTint();
					}
				})
			});
			agent.img.graphicsPath.forEach(function(element){
				element.clear();
			});
		}

		this.tweens.add({
			targets: agent.img,
			alpha: 0,
			duration: 1000,
			yoyo: false,
			repeat: 0,
			onComplete: function(){
				//agent.img.destroy();
				delete that.currentAgents[agentID];
			}
		});

		delete this.currentAgents[agentID];
		console.log(this.currentAgents);
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

			if(gameData.showScrollButton == "true" && this.agentCounter == 0){
				nodeIndex = 0;
			}
			if(gameData.showScrollButton == "true" && this.agentCounter == 1){
				nodeIndex = 2;
			}

			//copying values of selected startNode to not impact the startNode by later changes
			var startNode = {};
			for (var prop in this.startNodes[nodeIndex]){
				startNode[prop] = this.startNodes[nodeIndex][prop];
			}

			var newAgent = {};
			newAgent.img = this.add.image(startNode.x, startNode.y, agentType.name).setInteractive().setName('agent').setDepth(1).setAlpha(0);
			newAgent.img.setOrigin(gameData.agentOriginX, gameData.agentOriginY);
			let sizeMod = 0.2;
			if(agentType.sizeMultiplier){
				sizeMod = agentType.sizeMultiplier;
			}
			newAgent.img.setScale(this.height/newAgent.img.height * sizeMod);
			newAgent.img.id = this.currentAgentID;
			newAgent.type = agentType.name;
			newAgent.id = this.currentAgentID;
			newAgent.isHostile = agentType.isHostile;
			newAgent.pauseTime = agentType.pauseTime;
			newAgent.assignedDestination = agentType.assignedDestination;
			newAgent.name = agentType.name;
			newAgent.nodeID = startNode.id;
			newAgent.speed = agentType.speed;

			console.log(newAgent.img.rotation);

			if(newAgent.isHostile == "true"){
				newAgent.img.setName('hostileAgent');
			}

			this.tweens.add({
				targets: newAgent.img,
				alpha: 1,
				duration: 500,
				yoyo: false,
				repeat: 0,
			});

			this.currentAgents[this.currentAgentID] = newAgent;
			this.spawnedNodes[startNode.id].agentOnNode = this.currentAgentID;
			this.currentAgentID ++;
			this.currentAgentsOnBoard ++;

			//if agent was spawned, start his movement
			newAgent.img.lastNode = startNode;
			newAgent.img.timer = this.time.addEvent({delay: 1000 * newAgent.pauseTime, callback: this.moveAgentToNextNode, args: [newAgent.img, startNode], callbackScope: this});
			
			this.agentCounter ++;
		}
		this.spawnAgentTimer = this.time.addEvent({delay: this.spawnInterval * 1000, callback: this.spawnAgent, callbackScope: this});
	},

	onGameEnd: function(){
		this.cameras.main.scrollX = 0;
		this.scrolled = false;

		let lineColor = color.replace("#", "0x");
		var line = new Phaser.Geom.Line(-20, window.innerHeight/2 + window.innerHeight/20, window.innerWidth + 20, window.innerHeight/2 - window.innerHeight/20);
		var circle = new Phaser.Geom.Circle(window.innerWidth/2, window.innerHeight/2, window.innerHeight/6);
		this.CountdownGraphics = this.add.graphics({ lineStyle: { width: window.innerHeight/6, color: lineColor }, fillStyle: { color: lineColor } });
			
		this.CountdownGraphics.strokeLineShape(line);
		this.CountdownGraphics.fillCircleShape(circle);
		this.CountdownGraphics.setDepth(10);

		let countdownTextSize = window.innerHeight/10;
		this.countdownText = this.add.text(window.innerWidth/2, window.innerHeight/2, "+ " + this.calculateScore(), {font: countdownTextSize + 'px Arial', fill: '#ffffff'}).setDepth(10).setOrigin(0.5);
		
		let that = this;
		setTimeout(function(){
			let score = that.calculateScore();
			gameCallbacks.finishChallenge(score)
		}, 1000);

	}

});

let game;

let init = function(){
	// our game's configuration
	let config = {
		type: Phaser.CANVAS,  //using Canvas because performance is better
		width: window.innerWidth,
		height:  window.innerHeight,
		backgroundColor: gameData.backgroundColor,
		parent: 'game',
		displayVisibilityChange: true,
		scene: [ GraphGame]
	};

	game = new Phaser.Game(config);
}

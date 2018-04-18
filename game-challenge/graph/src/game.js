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
  gameData = event.data.data.challenge;
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
		//this.nodeCount = 35; 		//Defines the amount nodes for the graph.

		this.nodes = {};
		for(var key in gameData.nodes){
			if(key == "template"){
				continue;
			}
			this.nodes[key] = gameData.nodes[key];
			this.nodes[key].connectedTo = JSON.parse(gameData.nodes[key].connectedTo);
		}
		//console.log(this.nodes);

		this.controllPoints = {
			1 : {
				afterNode: 1,
				crashIf: [11, 0],
				pointsIf: [2],
				skin: 'schupo'
			}
		};
	
		//other variables needed
		this.agentSpawnRates = [];

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

		this.countedWinEvents = 0;
		this.displayPointsText;

		this.lineColor = gameData.lineColor;
		this.pathColor = gameData.pathColor;
	},

	preload: function(){
		for(var key in gameData.assets){
			if(key == "template"){
				continue;
			}
			this.load.image(gameData.assets[key].name, 'https://asset-server.barbara.eppsa.de/' + gameData.assets[key].image.src);
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

		this.displayPointsText = this.add.text(that.xPosToScreen(10), that.yPosToScreen(10), this.countedWinEvents * 10, {color: '#ff00ff', fontSize: '20px'});

		this.moveRight = this.add.image(this.width - this.width/2, this.height - this.height/20, 'button').setScale(0.1, 0.1).setName("right").setInteractive();
		this.moveLeft = this.add.image(2 * this.width - this.width/2, this.height - this.height/20, 'button').setScale(0.1, 0.1).setName("left").setInteractive();
		this.moveLeft.flipX = !this.moveLeft.flipX;

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
				gameObject.setTint(0xff0000);

				//push current nodeID into path
				for(var agent in that.currentAgents){
					if(gameObject == that.currentAgents[agent].img){
						console.log(that.spawnedNodes[that.currentAgents[agent].nodeID]);
						that.currentPath[that.currentPathID].path.push(that.spawnedNodes[that.currentAgents[agent].nodeID]);
					}
				}
				

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

				//console.log("Checking nodes");
				that.spawnedNodes.forEach(function(element){
					if( x - 35 <= element.img.x && element.img.x <= x + 35 && y - 35  <= element.img.y &&  element.img.y <= y + 35){
						//console.log("found node " + element.id);
						var pathLength = that.currentPath[that.currentPathID].path.length;
						if(pathLength == 0){
							console.log('this should not be logged out');
							that.currentPath[that.currentPathID].path.push(element);
						}else{
							var lastElement = that.currentPath[that.currentPathID].path[pathLength-1];
							if(element.connectedTo.indexOf(lastElement.id) != -1){
								let middleLine = new Phaser.Geom.Line(that.xPosToScreen(that.nodes[lastElement.id].xPosition), that.yPosToScreen(that.nodes[lastElement.id].yPosition), that.xPosToScreen(that.nodes[element.id].xPosition), that.yPosToScreen(that.nodes[element.id].yPosition));
								that.graphicsPath[that.pathCounter] = that.add.graphics({lineStyle: {width: 4, color: that.pathColor}});
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
		
		this.gameTimer = this.time.addEvent({delay: 1000 * this.timer, callback: this.onGameEnd, callbackScope: this, startAt: 0 });

	},

	moveAgentToNextNode(agent, node, pathID = null){
		let that = this;
		//console.log(agent.id);
		//console.log(node);
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
		for (var a in this.currentAgents){
			if(agent.id == this.currentAgents[a].id){
				currentlyMovingAgent = this.currentAgents[a];
				break;
			}
		}
		if(currentlyMovingAgent == undefined){
			return;
		}

		if(that.nodes[nextNode.id].nodeState == 'exit' && currentlyMovingAgent.assignedDestination.indexOf(nextNode.id) == -1){
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
			currentlyMovingAgent.img.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [currentlyMovingAgent.img, nextNode], callbackScope: that});
			return;
		}

		if(gameData.rotateAgents == "true"){
			if(Math.floor(agent.x) != Math.floor(nextNode.x)){
				//Math.floor(agent.x) > Math.floor(nextNode.x) ? agent.angle = 270 : agent.angle = 90;
				Math.floor(agent.x) > Math.floor(nextNode.x) ? that.changeToLeft(agent) : that.changeToRight(agent);
			}
			if(Math.floor(agent.y) != Math.floor(nextNode.y)){
				Math.floor(agent.y) > Math.floor(nextNode.y) ? that.changeToStraight(agent) : that.changeToBackwards(agent);
			}
		}
		
		let check = that.checkControlPoint(node.id, nextNode.id);

		if(check == "crash"){
			that.spawnedNodes[currentlyMovingAgent.nodeID].agentOnNode = undefined;
			//start movement
			agent.tween = this.tweens.add({
				targets: agent,
				x: nextNode.x,
				y: nextNode.y,
				duration: 1000,
				yoyo: false,
				repeat: 0,
			});
			//delete after half of duration
			that.time.addEvent({delay: 500, callback: that.destroyAgent, args: [currentlyMovingAgent.id], callbackScope: that});
			//that.destroyAgent(currentlyMovingAgent.id);
			return;
		}

		//TODO add agent.speed and line.length as variable in duration
		agent.tween = this.tweens.add({
			targets: agent,
			x: nextNode.x,
			y: nextNode.y,
			duration: 1000,
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
							that.moveAgentToNextNode(agentPush, nextNode);
						}
							
					}
						
				}
				that.spawnedNodes[nextNode.id].agentOnNode = currentlyMovingAgent.id;

				if(that.nodes[nextNode.id].nodeState == 'exit'){
					that.spawnedNodes[nextNode.id].agentOnNode = undefined;
					console.log('agent at exit');
					that.countedWinEvents ++;
					that.displayPointsText.setText(that.countedWinEvents * 10);

					that.destroyAgent(currentlyMovingAgent.id);
					return null;
				}

				if(that.nodes[nextNode.id].nodePauseTime && that.nodes[nextNode.id].nodePauseTime != 0){
					that.nodes[nextNode.id].timer = that.time.addEvent({delay: 1000 * that.nodes[nextNode.id].nodePauseTime, callback: that.rotateImage, args: [nextNode.id], callbackScope: that});
				}
				
				if(pathID != null){
					that.currentPath[pathID].path.shift();
					if(that.currentPath[pathID].path[1] != undefined){
						//node = that.currentPath[pathID].path[1];
						node = nextNode;
						agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [agent, node, pathID], callbackScope: that});
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
						agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [agent, nextNode], callbackScope: that});
					}
				}else{
					agent.timer = that.time.addEvent({delay: 1000 * (currentlyMovingAgent.pauseTime + that.nodes[nextNode.id].nodePauseTime), callback: that.moveAgentToNextNode, args: [agent, nextNode], callbackScope: that});
				}
				
			}
		});
			
	},

	changeToStraight: function(agent){
		agent.angle = 0;
		console.log("driving up");
		this.tweens.add({
			targets: agent,
				//angle: newAngle,
				y: agent.y - agent.height,
				duration: 100,
				yoyo: false,
				repeat: 0,
		})
	},
	changeToBackwards: function(agent){
		agent.angle = 180;
		console.log("driving down");
		this.tweens.add({
			targets: agent,
				//angle: newAngle,
				y: agent.y + agent.height,
				duration: 100,
				yoyo: false,
				repeat: 0,
		})
	},
	changeToLeft: function(agent){
		agent.angle = 270;
		this.tweens.add({
			targets: agent,
				//angle: newAngle,
				x: agent.x - agent.width,
				duration: 100,
				yoyo: false,
				repeat: 0,
		})
	},
	changeToRight: function(agent){
		agent.angle = 90;
		this.tweens.add({
			targets: agent,
				//angle: newAngle,
				x: agent.x + agent.width,
				duration: 100,
				yoyo: false,
				repeat: 0,
		})
	},

	checkControlPoint: function(current, next){
		console.log(current, next);
		//console.log(this.controllPoints);
		let point = this.controllPoints[current];
		//console.log(point);

		if(point){
			if(point.crashIf.indexOf(next) != -1){
				console.log("crash");
				return "crash";
			}
			if(point.pointsIf.indexOf(next) != -1){
				this.countedWinEvents ++;
				this.displayPointsText.setText(this.countedWinEvents * 10);
				console.log("points");
				return "points";
			}
		}

		return "";
	},

	rotateImage: function(image){
		let imageToRotate = this.controllPoints[image].image;
		console.log(imageToRotate);
		imageToRotate.angle == 90 ? imageToRotate.angle = 0 : imageToRotate.angle = 90;
		//imageToRotate.angle += 90;
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
				this.node.img.setScale(this.height * window.devicePixelRatio/this.node.img.height * 0.2)
			}else{
				this.node.img = that.add.sprite(this.xPosToScreen(currentNode.xPosition),this.yPosToScreen(currentNode.yPosition), currentNode.nodeState).setInteractive();
				this.node.img.setScale(this.height * window.devicePixelRatio/this.node.img.height * 0.02)
			}
			this.node.connectedTo = currentNode.connectedTo;
			this.node.pauseTime = currentNode.nodePauseTime;
			this.node.id = currentNode.nodeID;
			this.node.img.setName('node');
			if(gameData.drawLinesAndNodes != "true"){
				this.node.img.setAlpha(0);
			}

			that.add.text(this.xPosToScreen(currentNode.xPosition), this.yPosToScreen(currentNode.yPosition), that.nodes[node].nodeID, {fill: '#ffffff'});

			let controllPoint = this.controllPoints[currentNode.nodeID];
			if(controllPoint && controllPoint.skin != ''){
				console.log(currentNode.nodeID);
				controllPoint.image = that.add.image(this.xPosToScreen(currentNode.xPosition), this.yPosToScreen(currentNode.yPosition), controllPoint.skin).setOrigin(0.5).setScale(0.2);
			}

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
							var graphics = that.add.graphics({fillStyle: {color: that.lineColor}});
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

			//copying values of selected startNode to not impact the startNode by later changes
			var startNode = {};
			for (var prop in this.startNodes[nodeIndex]){
				startNode[prop] = this.startNodes[nodeIndex][prop];
			}

			var newAgent = {};
			newAgent.img = this.add.image(startNode.x, startNode.y, agentType.name).setInteractive().setName('agent').setDepth(1).setAlpha(0);
			newAgent.img.setOrigin(gameData.agentOriginX, gameData.agentOriginY);
			newAgent.img.setScale(this.height/newAgent.img.height * 0.2);
			newAgent.img.id = this.currentAgentID;
			newAgent.type = agentType.name;
			newAgent.id = this.currentAgentID;
			newAgent.isHostile = agentType.isHostile;
			newAgent.pauseTime = agentType.pauseTime;
			newAgent.assignedDestination = agentType.assignedDestination;
			newAgent.name = agentType.name;
			newAgent.nodeID = startNode.id;

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
			newAgent.img.timer = this.time.addEvent({delay: 1000 * newAgent.pauseTime, callback: this.moveAgentToNextNode, args: [newAgent.img, startNode], callbackScope: this});
		}
		this.spawnAgentTimer = this.time.addEvent({delay: this.spawnInterval * 1000, callback: this.spawnAgent, callbackScope: this});
	},

	onGameEnd: function(){
		console.log('game over');
		let score = this.countedWinEvents * 10;
		gameClient.source.postMessage(
			{
			  source: "challenge",
			  score,
			  id: "finish"
			}, gameClient.origin)
	}
	
});



let game;

let init = function(){
	// our game's configuration
	let config = {
		type: Phaser.CANVAS,  //using Canvas because performance is better
		width: window.innerWidth * window.devicePixelRatio,
		height:  window.innerHeight * window.devicePixelRatio,
		backgroundColor: gameData.backgroundColor,
		parent: 'game',
		displayVisibilityChange: true,
		scene: [ GraphGame] 
	};

	game = new Phaser.Game(config);
}
   
  

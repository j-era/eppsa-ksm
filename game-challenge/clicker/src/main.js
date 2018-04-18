import boot from "./boot.js";
import gameScene from "./gameScene.js";
import win from "./win.js";
import lose from "./lose.js";


class ContentServer {
	constructor(uri) {
		this.api = axios.create({ baseURL: uri })
	}

	getData(branch = "master", path = "") {
		return this.api.get(`/${branch}/content/${path}`).then((response) => response.data)
	}
}

var gameClient;
var gameData;

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

const contentServerUri = 'https://content-server.ramona.eppsa.de'
const assetServerUri = 'https://asset-server.ramona.eppsa.de'
const staticServerUri = 'https://static.ramona.eppsa.de'

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
		  //console.log("getting content");
		  const contentServer = new ContentServer(contentServerUri)
		//console.log(contentServer);
		contentServer.getData()
		.then((data) => {
			const content = selectContent(transform(data), challengeType, challengeNumber)
			//console.log(content)
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

var config = {
	type: Phaser.AUTO,
	parent: 'content',
	width: window.innerWidth * window.devicePixelRatio,
	height: window.innerHeight * window.devicePixelRatio,

	scene: [
	boot,
	gameScene,
	win,
	lose
	]
};

var init = function(){
	var game = new Phaser.Game(config);

	//console.log(gameData);

	game.gameData = gameData;

	game.completeChallenge = (score) => {
		setTimeout(() => {
		  gameClient.source.postMessage(
		    {
		      source: "challenge",
					score,
					id: "finish"
		    }, gameClient.origin)
		}, 1000)
	}
}

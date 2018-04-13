var assetsNodes = {
    0: {
        'nodeID' : 0, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 10,				//Sets the x-value for a node.
        'yPosition' : 15,				//Sets the y-value for a node.
        'connectedTo': [1,9],
        'skin' : '',
        'nodeState' : 'start',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    1: {
        'nodeID' : 1, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 45,				//Sets the x-value for a node.
        'yPosition' : 15,				//Sets the y-value for a node.
        'connectedTo': [0,2,10],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    2: {
        'nodeID' : 2, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 75,				//Sets the x-value for a node.
        'yPosition' : 15,				//Sets the y-value for a node.
        'connectedTo': [1,3],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    3: {
        'nodeID' : 3, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 90,				//Sets the x-value for a node.
        'yPosition' : 25,				//Sets the y-value for a node.
        'connectedTo': [2,4,11,12],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 4,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    4: {
        'nodeID' : 4, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 110,				//Sets the x-value for a node.
        'yPosition' : 20,				//Sets the y-value for a node.
        'connectedTo': [3,5,8,13],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    5: {
        'nodeID' : 5, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 140,				//Sets the x-value for a node.
        'yPosition' : 25,				//Sets the y-value for a node.
        'connectedTo': [4,6],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    6: {
        'nodeID' : 6, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 160,				//Sets the x-value for a node.
        'yPosition' : 15,				//Sets the y-value for a node.
        'connectedTo': [5,7],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    7: {
        'nodeID' : 7, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 190,				//Sets the x-value for a node.
        'yPosition' : 18,				//Sets the y-value for a node.
        'connectedTo': [6],
        'skin' : '',
        'nodeState' : 'start',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    8: {
        'nodeID' : 8, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 110,				//Sets the x-value for a node.
        'yPosition' : 5,				//Sets the y-value for a node.
        'connectedTo': [4],
        'skin' : 'smith',
        'nodeState' : 'exit',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },

    9: {
        'nodeID' : 9, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 10,				//Sets the x-value for a node.
        'yPosition' : 40,				//Sets the y-value for a node.
        'connectedTo': [0,10, 15],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    10: {
        'nodeID' : 10, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 45,				//Sets the x-value for a node.
        'yPosition' : 30,				//Sets the y-value for a node.
        'connectedTo': [1,9,11],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    11: {
        'nodeID' : 11, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 75,				//Sets the x-value for a node.
        'yPosition' : 40,				//Sets the y-value for a node.
        'connectedTo': [10,3,15,12],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    12: {
        'nodeID' : 12, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 95,				//Sets the x-value for a node.
        'yPosition' : 45,				//Sets the y-value for a node.
        'connectedTo': [3,11,13,20,16],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    13: {
        'nodeID' : 13, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 120,				//Sets the x-value for a node.
        'yPosition' : 45,				//Sets the y-value for a node.
        'connectedTo': [12,4,14,20,21],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    14: {
        'nodeID' : 14, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 190,				//Sets the x-value for a node.
        'yPosition' : 40,				//Sets the y-value for a node.
        'connectedTo': [13,5,7],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },

    15: {
        'nodeID' : 15, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 45,				//Sets the x-value for a node.
        'yPosition' : 45,				//Sets the y-value for a node.
        'connectedTo': [9,11,16],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    16: {
        'nodeID' : 16, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 75,				//Sets the x-value for a node.
        'yPosition' : 50,				//Sets the y-value for a node.
        'connectedTo': [15,12,18,19],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter anExit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },

    17: {
        'nodeID' : 17, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 5,				//Sets the x-value for a node.
        'yPosition' : 55,				//Sets the y-value for a node.
        'connectedTo': [18],
        'skin' : 'baker',
        'nodeState' : 'exit',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    18: {
        'nodeID' : 18, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 45,				//Sets the x-value for a node.
        'yPosition' : 55,				//Sets the y-value for a node.
        'connectedTo': [17,16,24,25],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    19: {
        'nodeID' : 19, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 80,				//Sets the x-value for a node.
        'yPosition' : 55,				//Sets the y-value for a node.
        'connectedTo': [16,20,25,26],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    20: {
        'nodeID' : 20, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 110,				//Sets the x-value for a node.
        'yPosition' : 55,				//Sets the y-value for a node.
        'connectedTo': [19,12,13,21,28],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    21: {
        'nodeID' : 21, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 140,				//Sets the x-value for a node.
        'yPosition' : 50,				//Sets the y-value for a node.
        'connectedTo': [20,13,22,29],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    22: {
        'nodeID' : 22, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 160,				//Sets the x-value for a node.
        'yPosition' : 55,				//Sets the y-value for a node.
        'connectedTo': [21],
        'skin' : 'shoemaker',
        'nodeState' : 'exit',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 4,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },


    23: {
        'nodeID' : 23, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 10,				//Sets the x-value for a node.
        'yPosition' : 80,				//Sets the y-value for a node.
        'connectedTo': [24,31],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    24: {
        'nodeID' : 24, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 45,				//Sets the x-value for a node.
        'yPosition' : 75,				//Sets the y-value for a node.
        'connectedTo': [23,18,25,32],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination	nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    25: {
        'nodeID' : 25, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 70,				//Sets the x-value for a node.
        'yPosition' : 75,				//Sets the y-value for a node.
        'connectedTo': [24,18,19,33],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    26: {
        'nodeID' : 26, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 90,				//Sets the x-value for a node.
        'yPosition' : 75,				//Sets the y-value for a node.
        'connectedTo': [19,27,28],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    27: {
        'nodeID' : 27, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 90,				//Sets the x-value for a node.
        'yPosition' : 90,				//Sets the y-value for a node.
        'connectedTo': [26],
        'skin' : 'tailor',
        'nodeState' : 'exit',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    28: {
        'nodeID' : 28, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 115,				//Sets the x-value for a node.
        'yPosition' : 75,				//Sets the y-value for a node.
        'connectedTo': [26,20,29,34],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    29: {
        'nodeID' : 29, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 140,				//Sets the x-value for a node.
        'yPosition' : 75,				//Sets the y-value for a node.
        'connectedTo': [21,28,34],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    30: {
        'nodeID' : 30, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 190,				//Sets the x-value for a node.
        'yPosition' : 80,				//Sets the y-value for a node.
        'connectedTo': [29],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },

    31: {
        'nodeID' : 31, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 10,				//Sets the x-value for a node.
        'yPosition' : 90,				//Sets the y-value for a node.
        'connectedTo': [23,32],
        'skin' : '',
        'nodeState' : 'start',		    //A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    32: {
        'nodeID' : 32, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 45,				//Sets the x-value for a node.
        'yPosition' : 85,				//Sets the y-value for a node.
        'connectedTo': [31,24,33],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    33: {
        'nodeID' : 33, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 70,				//Sets the x-value for a node.
        'yPosition' : 90,				//Sets the y-value for a node.
        'connectedTo': [32,25],
        'skin' : '',
        'nodeState' : 'start',		    //A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    34: {
        'nodeID' : 34, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 140,				//Sets the x-value for a node.
        'yPosition' : 90,				//Sets the y-value for a node.
        'connectedTo': [28,29,35],
        'skin' : '',
        'nodeState' : 'regular',		//A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },
    35: {
        'nodeID' : 35, 					//Gives each node an identifier (e.g. used for EdgeDirection
        'xPosition' : 190,				//Sets the x-value for a node.
        'yPosition' : 95,				//Sets the y-value for a node.
        'connectedTo': [30,34],
        'skin' : '',
        'nodeState' : 'start',		    //A node can have following states: 'regular', 'start', 'exit', 'startExit'
        'isStart' : false,				//Defines a node as a StartNode. Set to true while IsExit is true, will set the node's state to StartExit.
        'isExit': false,				//Defines a node as an ExitNode. Set to true while IsStart is true, will set  the node's state to StartExit.
        'exptectedVisitors': 5,			//Defines what number of which agent class are required to enter an Exit node, to trigger a win-event.
        'nodePauseTime': 0,				//Adds to the PauseTime of an agent. Gives the designer the option to make an exemption for some nodes, when agents aren't set to pause on nodes (like in the traffic game or the 								destination nodes in the Heinzelmännchen game).
        'collisionEventNode': false,	//Sets whether a collision between two agents on a node is registered (to trigger an event) or not. 
        'edgeTreshold': 1.4,			//Sets the threshold within which the player's input is registered (along the edge's width).
        'edgeDirection': 'none',		//Edges can have directions set, which may influence agent behaviour or trigger events if not followed. An edge's direction is defined by the nodes it's connecting.
        'collisonEventEdge': true		//Sets whether a collision between two agents on an edge is registered (to trigger an event) or not.
    },

}
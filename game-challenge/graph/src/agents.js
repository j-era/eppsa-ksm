var availableClasses = [
    {
        name: "bakerh",				//Name of the class (e.g. baker, blacksmith).
        classes: 5,					//Defines the number of agent classes for the game.
        classCap: 40,				//Defines the max. amount agents of class that can spawn.
        spawnProbability: 0.2,		//Defines the probability with which an agent of this class will spawn.
        isHostile: false,			//Defines whether the agent is hostile towards other agents or not.
        pauseTime: 2.5,				//Counts down the time until the agent moves to the next node. The countdown is activated when the agent enters a node. PauseTime is also the time the 								player has input a new route for the agent.
        speed: 1,					//Sets the speed with which an agent moves between nodes. The speed is relative to the length of the edge (distance between nodes).
        localRotation: 90,			//Sets the agent's local rotation while on a node or moving along an edge.	
        assignedDestination: 0,		//Sets the destination, the player has to move the agent to, from the list of nodes.
        collisionRadius: 0.5		//Sets the radius in which a collision between two agents is registered.
    },
    {
        name: "smithh",				//Name of the class (e.g. baker, blacksmith).
        classes: 5,					//Defines the number of agent classes for the game.
        classCap: 40,				//Defines the max. amount agents of class that can spawn.
        spawnProbability: 0.2,		//Defines the probability with which an agent of this class will spawn.
        isHostile: false,			//Defines whether the agent is hostile towards other agents or not.
        pauseTime: 1.9,				//Counts down the time until the agent moves to the next node. The countdown is activated when the agent enters a node. PauseTime is also the time the 								player has input a new route for the agent.
        speed: 1,					//Sets the speed with which an agent moves between nodes. The speed is relative to the length of the edge (distance between nodes).
        localRotation: 90,			//Sets the agent's local rotation while on a node or moving along an edge.	
        assignedDestination: 0,		//Sets the destination, the player has to move the agent to, from the list of nodes.
        collisionRadius: 0.5		//Sets the radius in which a collision between two agents is registered.
    },
    {
        name: "tailorh",			//Name of the class (e.g. baker, blacksmith).
        classes: 5,					//Defines the number of agent classes for the game.
        classCap: 40,				//Defines the max. amount agents of class that can spawn.
        spawnProbability: 0.2,		//Defines the probability with which an agent of this class will spawn.
        isHostile: false,			//Defines whether the agent is hostile towards other agents or not.
        pauseTime: 2,				//Counts down the time until the agent moves to the next node. The countdown is activated when the agent enters a node. PauseTime is also the time the 								player has input a new route for the agent.
        speed: 1,					//Sets the speed with which an agent moves between nodes. The speed is relative to the length of the edge (distance between nodes).
        localRotation: 90,			//Sets the agent's local rotation while on a node or moving along an edge.	
        assignedDestination: 0,		//Sets the destination, the player has to move the agent to, from the list of nodes.
        collisionRadius: 0.5		//Sets the radius in which a collision between two agents is registered.
    },
    {
        name: "shoemakerh",			//Name of the class (e.g. baker, blacksmith).
        classes: 5,					//Defines the number of agent classes for the game.
        classCap: 40,				//Defines the max. amount agents of class that can spawn.
        spawnProbability: 0.2,		//Defines the probability with which an agent of this class will spawn.
        isHostile: false,			//Defines whether the agent is hostile towards other agents or not.
        pauseTime: 2.1,				//Counts down the time until the agent moves to the next node. The countdown is activated when the agent enters a node. PauseTime is also the time the 								player has input a new route for the agent.
        speed: 1,					//Sets the speed with which an agent moves between nodes. The speed is relative to the length of the edge (distance between nodes).
        localRotation: 90,			//Sets the agent's local rotation while on a node or moving along an edge.	
        assignedDestination: 0,		//Sets the destination, the player has to move the agent to, from the list of nodes.
        collisionRadius: 0.5		//Sets the radius in which a collision between two agents is registered.
    },
    {
        name: "tailorwife",			//Name of the class (e.g. baker, blacksmith).
        classes: 5,					//Defines the number of agent classes for the game.
        classCap: 1,				//Defines the max. amount agents of class that can spawn.
        spawnProbability: 0.2,		//Defines the probability with which an agent of this class will spawn.
        isHostile: true,			//Defines whether the agent is hostile towards other agents or not.
        pauseTime: 2.2,				//Counts down the time until the agent moves to the next node. The countdown is activated when the agent enters a node. PauseTime is also the time the 								player has input a new route for the agent.
        speed: 1,					//Sets the speed with which an agent moves between nodes. The speed is relative to the length of the edge (distance between nodes).
        localRotation: 90,			//Sets the agent's local rotation while on a node or moving along an edge.	
        assignedDestination: 0,		//Sets the destination, the player has to move the agent to, from the list of nodes.
        collisionRadius: 0.5		//Sets the radius in which a collision between two agents is registered.
    },
]

var Client = {};
Client.socket = io.connect(); //define server here, localhost if empty

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
}

Client.askForMatch = function(){
    Client.socket.emit('findmatch');
}

Client.readyToPlay = function(data){
    Client.socket.emit('playerready', data);
}

Client.ArrowChange = function(data){
    Client.socket.emit('arrowchange', data);
}

Client.socket.on('newplayer',function(data){
    console.log('newplayer client ', data);
    game.scene.scenes[0].addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    console.log('allplayers client ', data);
    for(var i = 0; i < data.length; i++){
        game.scene.scenes[0].addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

Client.socket.on('matchedwith', function(data){
    console.log('matched with ' + data);
    game.scene.scenes[0].startGameWithMatchedPartner(data);
});

Client.socket.on('currentmatchingstatus', function(data){
    console.log('current Matching status :', data);
    game.scene.scenes[0].showMatchingStatus(data);
});

Client.socket.on('startgame', function(){
    console.log('startingGame');
    game.scene.scenes[1].startMultiplayerGame();
});

Client.socket.on('arrowchange', function(data){
    game.scene.scenes[1].moveOpponentArrow(data);
})

Client.socket.on('remove', function(id){
    game.scene.scenes[0].removePlayer(id);
});
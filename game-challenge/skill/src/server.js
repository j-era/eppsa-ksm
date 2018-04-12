var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname));
app.use('/assets',express.static(__dirname +'/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`Example listening on port ${PORT}!`)
  })

server.lastPlayerID = 0;
server.lastMatchID = 0;
server.freePlayers = [];

io.on('connection',function(socket){
    socket.on('newplayer',function(){
        console.log('new player entered');
        socket.player = {
            id: server.lastPlayerID++,
            ready: false
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);
        socket.emit('currentmatchingstatus', findMatchForPlayer(socket, socket.player));

        socket.on('disconnect', function(){
            io.emit('remove', socket.player.id);
            server.freePlayers.splice(0, 1);
        });

        socket.on('arrowchange', function(data){
            Object.keys(io.sockets.connected).forEach(function(socketID){
                if(io.sockets.connected[socketID].player != null){
                    if(io.sockets.connected[socketID].player.id == data.listener){
                        io.sockets.connected[socketID].emit('arrowchange', data.rotation);
                    }
                }
                
            });
        });

        socket.on('playerready', function(data){
            console.log('setting player to ready', data);
            socket.player.ready = true;

            Object.keys(io.sockets.connected).forEach(function(socketID){
                if(io.sockets.connected[socketID].player != null){
                    console.log('players found');
                    if(io.sockets.connected[socketID].player.id == data.other && io.sockets.connected[socketID].player.ready){
                        console.log('partner found');
                        io.sockets.connected[socketID].emit('startgame');
                        socket.emit('startgame');
                    }
                }
                
            });
        });

        socket.on('finalscore', function(data){
            console.log('receiving score', data);
            socket.player.score = data.score;

            Object.keys(io.sockets.connected).forEach(function(socketID){
                if(io.sockets.connected[socketID].player != null){
                    console.log('players found');
                    if(io.sockets.connected[socketID].player.id == data.other && io.sockets.connected[socketID].player.score != undefined){
                        console.log('partner found');
                        if(io.sockets.connected[socketID].player.score == socket.player.score){
                            io.sockets.connected[socketID].emit('score', socket.player.score);
                            socket.emit('score', socket.player.score);
                        }else{
                            let finalScore = io.sockets.connected[socketID].player.score > socket.player.score ? io.sockets.connected[socketID].player.score : socket.player.score;
                            io.sockets.connected[socketID].emit('score', finalScore);
                            socket.emit('score', finalScore);
                            
                        }
                    }
                }
                
            });
        })

    });

    
});

function findMatchForPlayer(socket, player){
    if(server.freePlayers.length != 0){
        let connectedPlayer = server.freePlayers[0].player;

        let first_ship = Math.random() >= 0.5;

        if(first_ship){
            socket.emit('matchedwith', {'other': connectedPlayer.id, 'own': player.id, 'playing' : 'ship'});
            server.freePlayers[0].emit('matchedwith', {'other': player.id, 'own': connectedPlayer.id, 'playing' : 'wind' });
        }else{
            socket.emit('matchedwith', {'other': connectedPlayer.id, 'own': player.id, 'playing' : 'wind'});
            server.freePlayers[0].emit('matchedwith', {'other': player.id, 'own': connectedPlayer.id, 'playing' : 'ship'});
        }

        server.freePlayers.splice(0, 1);
        return('Trying to match you with player ' +  connectedPlayer.id);
    }else{
        server.freePlayers.push(socket);
        return ('No free player found, waiting for new player');
    }
    
}

function getAllPlayers(){
    console.log('getting all players');
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
var BTTank = require('./objects/bttank.js');
var BTMissile = require('./objects/btmissile.js');
var BTWall = require('./objects/btwall.js');
var BTGrass = require('./objects/btgrass.js');
var BTSteel = require('./objects/btsteel.js');
var BTWater = require('./objects/btwater.js');
var config = require('./config.js');
var BTRoom = require('./btroom.js');

exports.startGameServer = function (expressServer) {
    var io = require('socket.io')(expressServer);
    var roomIndex = 0;
    var rooms = [];
    var maxRoomNumber = 2;

    function GetAvailableRoom()
    {
        //Search the not full serverItem
        for(var ri = 0; ri < rooms.length; ri++)
        {
            var currentRoom = rooms[ri];
            if(!currentRoom.isAvailable)
                continue;

            return currentRoom;
        }

        //Server cannot afford too many rooms
        if(roomIndex > config.room.maxRoomNumber)
            return null;

        //No available serverItem, then create new one
        roomIndex++;
        var newRoom = new BTRoom(io, roomIndex); 
        rooms.push(newRoom);
        console.log('Room ' + roomIndex + " created!");         

        return newRoom;       
    }


    io.on('connection', function (socket) {
    	var room = GetAvailableRoom();
        if(room === null)//no available room
            return;

    	socket.join(room.roomId);

        room.OnConnection(socket);


        socket.on('disconnect', function () {
        	room.OnDisconnect(socket);
        });

		socket.on('left', function(data){
			room.OnLeft(socket);
		});

		socket.on('right', function(data){
			room.OnRight(socket);
		});

		socket.on('up', function(data){
			room.OnUp(socket);

		});

		socket.on('down', function(data){
			room.OnDown(socket);
		});

		socket.on('fire', function(data) {
			room.OnFire(socket);
		});
	});
};

var BTTank = require('./objects/bttank.js');
var BTMissile = require('./objects/btmissile.js');
var BTWall = require('./objects/btwall.js');
var BTGrass = require('./objects/btgrass.js');
var BTSteel = require('./objects/btsteel.js');
var BTWater = require('./objects/btwater.js');
var config = require('./config.js');
var serverItem = require('./serverItem.js');

exports.startGameServer = function (expressServer) {
    var io = require('socket.io')(expressServer);
    var channelIndex = 0;
    var connectIndex = 0;
    var sis = [];


    io.on('connection', function (socket) {
    	var si;

    	//Create new channel
    	if(connectIndex%2 === 0)
    	{
    		channelIndex++;
    		si = new serverItem(io, channelIndex);
    		sis.push(si);    		
    	}
    	else
    	{
    		si = sis[channelIndex-1];
    	}
    	connectIndex++;    	
    	socket.join(channelIndex);      

        si.OnConnection(socket);


        socket.on('disconnect', function () {
        	si.OnDisconnect(socket);
        });

		socket.on('left', function(data){
			si.OnLeft(socket);
		});

		socket.on('right', function(data){
			si.OnRight(socket);
		});

		socket.on('up', function(data){
			si.OnUp(socket);

		});

		socket.on('down', function(data){
			si.OnDown(socket);
		});

		socket.on('fire', function(data) {
			si.OnFire(socket);
		});
	});
};

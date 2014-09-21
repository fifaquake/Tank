var BTTank = require('./objects/bttank.js');

exports.startGameServer = function (expressServer) {
    var clientCount = 0;
    var io = require('socket.io')(expressServer);
    io.on('connection', function (socket) {
		var tanks = [];
		
		var p1Tank;
		var p2Tank;

        clientCount++;
        socket.emit('welcome', { 'id': clientCount });

        console.log('a user connected');

        socket.on('disconnect', function () {
			// remove the last tanks
            clientCount--;
			tanks[clientCount] = null;
            console.log('user disconnected');
        });

        var resource;
        if (clientCount === 1) {
			p1Tank = new BTTank('p1tankU.gif', 0, 0);
            resource = p1Tank.resource;
			tanks.push(p1Tank);
        } else if (clientCount === 2){
			p2Tank = new BTTank('p2tankU.gif', 0 , 0);
            resource = p2Tank.resource;
			tanks.push(p2Tank);
        } else {
			resource = null;
		}
        socket.emit('update', { 'tanks': tanks });

        socket.on('disconnect', function () {
			// remove the last tanks
			tanks.pop();
            clientCount--;
            console.log('user disconnected');
        });

		socket.on('left', function(data){
			var id = data.id;
			var curTank = tanks[id - 1];
			curTank.x = curTank.x - 10;
			curTank.resource = 'p' + id + 'tankL.gif';
			tanks[id - 1] = curTank;

			socket.emit('update', { 'tanks': tanks });
		});
		socket.on('right', function(data){
			var id = data.id;
			var curTank = tanks[id - 1];
			curTank.x = curTank.x + 10;
			curTank.resource = 'p' + id + 'tankR.gif';
			tanks[id - 1] = curTank;

			socket.emit('update', { 'tanks': tanks });
		});
		socket.on('up', function(data){
			var id = data.id;
			var curTank = tanks[id - 1];
			curTank.y = curTank.y - 10;
			curTank.resource = 'p' + id + 'tankU.gif';
			tanks[id - 1] = curTank;

			socket.emit('update', { 'tanks': tanks });
		});
		socket.on('down', function(data){
			var id = data.id;
			var curTank = tanks[id - 1];
			curTank.y = curTank.y + 10;
			curTank.resource = 'p' + id + 'tankD.gif';
			tanks[id - 1] = curTank;

			socket.emit('update', { 'tanks': tanks });
		});
    });
};

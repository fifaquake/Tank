var BTTank = require('./objects/bttank.js');

function IsCrash(tank1, tank2)
{
	if ((tank1.x - tank2.x)<(tank1.width+tank2.width)/2 && (tank1.y - tank2.y) < (tank1.height + tank2.height)/2)
		return true;
	else
		return false;
}

exports.startGameServer = function (expressServer) {
    var io = require('socket.io')(expressServer);
	var p1Tank = null;
	var p2Tank = null;

	// get current tank by using the socket id
	function getCurrentTank(socketId) {
		var curTank;
		if (p1Tank.id === socketId) {
			curTank = p1Tank;
		}
		else if (p2Tank.id === socketId) {
			curTank = p2Tank;
		}
		else
			curTank = null; 

		return curTank;
	}

	function getRandomX() {
		var x = Math.floor(Math.random() * 800);
		console.log("X = " + x);

		return x;
	}

	function getRandomY() {
		var y = Math.floor(Math.random() * 600);
		console.log("Y = " + y);

		return y;
	}

    io.on('connection', function (socket) {

        socket.emit('welcome', null);

        console.log('a user connected with id = ' + socket.id);

        if (p1Tank === null) {
			p1Tank = new BTTank('p1tankU.gif', 'p1tankD.gif', 'p1tankL.gif', 'p1TankR.gif',
								 getRandomX(), getRandomY(), socket.id);
        } else if (p2Tank === null){
			p2Tank = new BTTank('p2tankU.gif', 'p2tankD.gif', 'p2tankL.gif', 'p2TankR.gif',
								 getRandomX(), getRandomY(), socket.id);
        } else {
			return;
		}

		io.emit('update', { 'tanks': [p1Tank, p2Tank] });

        socket.on('disconnect', function () {
			if (p1Tank && p1Tank.id === socket.id) {
				p1Tank = null;
			}
			else if (p2Tank && p2Tank.id === socket.id) {
				p2Tank = null;
			}
            
			console.log('user disconnected');
			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
        });

		socket.on('left', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			curTank.x = curTank.x - 10;
<<<<<<< HEAD
			if(curTank.x <= curTank.width/2)//boundary check
				curTank.x = curTank.width/2;

			curTank.resource = 'p' + id + 'tankL.gif';
=======
			curTank.resource = curTank.leftResource;
>>>>>>> fcb46c02d61e30e8d31c361fb31bfb9c75ad06aa

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});

		socket.on('right', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			curTank.x = curTank.x + 10;
<<<<<<< HEAD
			if(curTank.x >= 800 - curTank.width/2)//boundary check
				curTank.x = 800-curTank.width/2;

			curTank.resource = 'p' + id + 'tankR.gif';
=======
			curTank.resource = curTank.rightResource;
>>>>>>> fcb46c02d61e30e8d31c361fb31bfb9c75ad06aa

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});

		socket.on('up', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			curTank.y = curTank.y - 10;
<<<<<<< HEAD
			if(curTank.y <= curTank.height/2)//boundary check
				curTank.y = curTank.height/2;

			curTank.resource = 'p' + id + 'tankU.gif';
=======
			curTank.resource = curTank.upResource;
>>>>>>> fcb46c02d61e30e8d31c361fb31bfb9c75ad06aa

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});

		socket.on('down', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;
			curTank.y = curTank.y + 10;
<<<<<<< HEAD
			if(curTank.y > 600 - curTank.height/2)//boundary check
				curTank.y = 600- curTank.height/2;

			curTank.resource = 'p' + id + 'tankD.gif';
=======
			curTank.resource =  curTank.downResource;
>>>>>>> fcb46c02d61e30e8d31c361fb31bfb9c75ad06aa

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});
    });
};

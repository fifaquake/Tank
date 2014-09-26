var BTTank = require('./objects/bttank.js');
var BTMissile = require('./objects/btmissile.js');

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
	var missiles = [];

	var timer = setInterval(onTimer, 1000);
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

	function update() {
		io.emit('update',{ 'tanks': [p1Tank, p2Tank], 'missiles' : missiles});
	}
	function onTimer() {
		if (missiles.length === 0) return;

		for (var i = 0; i < missiles.length; i++) {
			var curMissile = missiles[i];
			curMissile.move();
		}
		update();
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

		update();
        socket.on('disconnect', function () {
			if (p1Tank && p1Tank.id === socket.id) {
				p1Tank = null;
			}
			else if (p2Tank && p2Tank.id === socket.id) {
				p2Tank = null;
			}
            
			console.log('user disconnected');
			update();
        });

		socket.on('left', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			curTank.moveLeft();
			update();
		});

		socket.on('right', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			curTank.moveRight();
			update();
		});

		socket.on('up', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;
			curTank.moveUp();
			update();
		});

		socket.on('down', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;
			curTank.moveDown();
			update();
		});

		socket.on('fire', function(data) {
			var curTank = getCurrentTank(socket.id);
			var position = curTank.getMissilePosition();
			var missile = new BTMissile(position.x, position.y, socket.id, curTank.direction);
			missiles.push(missile);
			update();
		});
	});
};

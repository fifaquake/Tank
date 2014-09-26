var BTTank = require('./objects/bttank.js');
var BTMissile = require('./objects/btmissile.js');
var clientConfig = require('./clientconfig.js');

exports.startGameServer = function (expressServer) {
    var io = require('socket.io')(expressServer);
	var p1Tank = null;
	var p2Tank = null;
	var missiles = [];

	var timer = setInterval(onTimer, 100);
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

		console.log("There are still " + missiles.length + " missiles");

		for (var i = missiles.length - 1; i >= 0; i--) {
			var curMissile = missiles[i];
			curMissile.move();
			if (!curMissile.isValid()) {
				console.log("x = ", curMissile.x);
				console.log("y = ", curMissile.y);
				missiles.splice(i, 1);
			}
		}
		update();
	}

    io.on('connection', function (socket) {

        socket.emit('welcome', {'width' : clientConfig.Width, 'height' : clientConfig.Height});

        console.log('a user connected with id = ' + socket.id);

        if (p1Tank === null) {
			p1Tank = new BTTank('p1tankU.gif', 'p1tankD.gif', 'p1tankL.gif', 'p1TankR.gif', socket.id);
        } else if (p2Tank === null){
			p2Tank = new BTTank('p2tankU.gif', 'p2tankD.gif', 'p2tankL.gif', 'p2TankR.gif', socket.id);
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

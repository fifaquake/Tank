var BTTank = require('./objects/bttank.js');
var BTMissile = require('./objects/btmissile.js');
var BTWall = require('./objects/btwall.js');
var BTGrass = require('./objects/btgrass.js');
var config = require('./config.js');

exports.startGameServer = function (expressServer) {
    var io = require('socket.io')(expressServer);
	var p1Tank = null;
	var p2Tank = null;
	var missiles = [];
	var walls = [];
	var grasses = [];
	var sceneMatrix =[
	[0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,1,1,1,0,0,0,1,1,1,0,0],
	[0,0,2,0,2,0,0,0,0,2,0,0,0],
	[0,0,2,2,2,0,0,0,0,2,0,0,0],
	[0,0,2,0,2,0,0,0,0,2,0,0,0],
	[0,0,1,1,1,0,0,0,0,1,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0],
	];

	function createScene()
	{
		walls = [];
		grasses = [];
		for(var row =0; row < sceneMatrix.length; row++)
		{
			for (var column = 0; column < sceneMatrix[row].length; column++)
			{
				if(sceneMatrix[row][column]==1)
				{
					walls.push(new BTWall(column,row));						
				}

				if(sceneMatrix[row][column]==2)
				{
					grasses.push(new BTGrass(column,row));						
				}

				//Add other type
			}
		}

	}

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

	function getOtherTank(socketId) {
		var curTank;
		if (p1Tank &&(p1Tank.id !== socketId)) {
			curTank = p1Tank;
		}
		else if (p2Tank && (p2Tank.id !== socketId)) {
			curTank = p2Tank;
		}
		else
			curTank = null; 

		return curTank;
	}

	function getOtherTanks(socketId) {
		var otherTank = getOtherTank(socketId);

		if (otherTank !== null) {
			return [otherTank];
		}
		else {
			return [];
		}
	}

	function canfire(socketId)
	{
		existMissileNumber = 0;
		for(var index = 0; index < missiles.length; index++)
		{
			if(missiles[index].id == socketId)
			{
				existMissileNumber++;
				if(existMissileNumber >= config.missile.MaxNumber)
					return false;
			}
		}

		return true;
	}

	function update() {

		var allobjects = [];
		allobjects = allobjects.concat(missiles);
		allobjects = allobjects.concat(walls);
		allobjects = allobjects.concat([p1Tank, p2Tank]);
		allobjects = allobjects.concat(grasses);
		if(p1Tank != null)
			allobjects = allobjects.concat(p1Tank.BTHPs)
		if(p2Tank != null)
			allobjects = allobjects.concat(p2Tank.BTHPs)

		io.emit('update',{ 'objects': allobjects});
	}
	function onTimer() {
		if (missiles.length === 0) return;

		console.log("There are still " + missiles.length + " missiles");

		for (var i = missiles.length - 1; i >= 0; i--) {
			var curMissile = missiles[i];
			curMissile.move(p1Tank, p2Tank, walls);
			if (!curMissile.isValid()) {
				console.log("x = ", curMissile.x);
				console.log("y = ", curMissile.y);
				missiles.splice(i, 1);
			}
		}
		update();
	}

    io.on('connection', function (socket) {

        socket.emit('welcome', {'width' : config.screen.width, 'height' : config.screen.height});

        console.log('a user connected with id = ' + socket.id);

        if (p1Tank === null) {
			p1Tank = new BTTank(1, socket.id);
			createScene();

        } else if (p2Tank === null){
			p2Tank = new BTTank(2, socket.id);
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

			var btObjects = [];
			btObjects = btObjects.concat(walls);
			btObjects = btObjects.concat(getOtherTanks(socket.id));
			curTank.moveLeft(btObjects);			
			update();
		});

		socket.on('right', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			var btObjects = [];
			btObjects = btObjects.concat(walls);
			btObjects = btObjects.concat(getOtherTanks(socket.id));
			curTank.moveRight(btObjects);
			update();
		});

		socket.on('up', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			var btObjects = [];
			btObjects = btObjects.concat(walls);
			btObjects = btObjects.concat(getOtherTanks(socket.id));
			curTank.moveUp(btObjects);
			update();
		});

		socket.on('down', function(data){
			var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;

			var btObjects = [];
			btObjects = btObjects.concat(walls);
			btObjects = btObjects.concat(getOtherTanks(socket.id));
			curTank.moveDown(btObjects);
			update();
		});

		socket.on('fire', function(data) {
			if(!canfire(socket.id))
				return;

			var curTank = getCurrentTank(socket.id);
			var position = curTank.getMissilePosition();
			var missile = new BTMissile(position.x, position.y, socket.id, curTank.direction);
			missiles.push(missile);
			update();
		});
	});
};

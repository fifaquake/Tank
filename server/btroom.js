var BTTank = require('./objects/bttank.js');
var BTMissile = require('./objects/btmissile.js');
var BTWall = require('./objects/btwall.js');
var BTGrass = require('./objects/btgrass.js');
var BTSteel = require('./objects/btsteel.js');
var BTWater = require('./objects/btwater.js');
var config = require('./config.js');

var BTRoom = function (io, roomIndex) {
	this.roomId = roomIndex;
	this.isAvailable = true;
	var isSceneCreated = false;
	var p1Tank = null;
	var p2Tank = null;
	var missiles = [];
	var walls = [];
	var grasses = [];
	var steels = [];
	var waters = [];
	var waterNumber = 0;
	var sceneMatrix = config.room.rooms[roomIndex-1];

	function createScene()
	{
		if(isSceneCreated)//Create scene once
			return;

		walls = [];
		grasses = [];
		steels = [];
		waters = [];
		waterNumber = 0;
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

				if(sceneMatrix[row][column]==3)
				{
					steels.push(new BTSteel(column,row));						
				}

				if(sceneMatrix[row][column]==4)
				{
					waters.push(new BTWater(column,row));
					waterNumber++;					
				}

				//Add other type
			}
		}

		isSceneCreated = true;

	}

	function getTankBlocks(socketId)
	{
		var btObjects = [];
		btObjects = btObjects.concat(walls);
		btObjects = btObjects.concat(steels);
		btObjects = btObjects.concat(waters);
		btObjects = btObjects.concat(getOtherTanks(socketId));
		return  btObjects;
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
		allobjects = allobjects.concat(waters);
		allobjects = allobjects.concat(missiles);
		allobjects = allobjects.concat(walls);
		allobjects = allobjects.concat(steels);
		allobjects = allobjects.concat([p1Tank, p2Tank]);
		allobjects = allobjects.concat(grasses);
		if(p1Tank !== null)
			allobjects = allobjects.concat(p1Tank.BTHPs);
		if(p2Tank !== null)
			allobjects = allobjects.concat(p2Tank.BTHPs);

		io.sockets.in(roomIndex).emit('update',{ 'objects': allobjects, 'insertIndex':waterNumber});
	}
	function onTimer() {
		if (missiles.length === 0) return;

		console.log("There are still " + missiles.length + " missiles");

		for (var i = missiles.length - 1; i >= 0; i--) {
			var curMissile = missiles[i];
			curMissile.move(p1Tank, p2Tank, walls, steels);
			if (!curMissile.isValid()) {
				console.log("x = ", curMissile.x);
				console.log("y = ", curMissile.y);
				missiles.splice(i, 1);
			}
		}
		update();
	}

	this.OnConnection = function(socket)
	{
		socket.emit('welcome', {'width' : config.screen.width, 'height' : config.screen.height});
	    console.log('a user connected with id = ' + socket.id);

	    createScene();

        if (p1Tank === null) 
        {
			p1Tank = new BTTank(1, socket.id);
        } 
        else if (p2Tank === null)
        {
			p2Tank = new BTTank(2, socket.id);
        } 
        else 
        {
			return;
		}

		if(p1Tank !== null	&& p2Tank !== null)
		{
			this.isAvailable = false;
		}

		update();		
	};

	this.OnDisconnect = function(socket)
	{
		if (p1Tank && p1Tank.id === socket.id) {
			p1Tank = null;
		}
		else if (p2Tank && p2Tank.id === socket.id) {
			p2Tank = null;
		}
        
        this.isAvailable = true;
		console.log('user disconnected');
		update();		
	};

	this.OnLeft = function(socket)
	{
		var curTank = getCurrentTank(socket.id);
		if (curTank === null) return;
		curTank.moveLeft(getTankBlocks(socket.id));			
		update();
	};

	this.OnRight = function(socket)
	{
		var curTank = getCurrentTank(socket.id);
		if (curTank === null) return;
		curTank.moveRight(getTankBlocks(socket.id));
		update();		
	};

	this.OnUp = function(socket)
	{
		var curTank = getCurrentTank(socket.id);
		if (curTank === null) return;
		curTank.moveUp(getTankBlocks(socket.id));
		update();
	};

	this.OnDown = function(socket)
	{
				var curTank = getCurrentTank(socket.id);
			if (curTank === null) return;
			curTank.moveDown(getTankBlocks(socket.id));
			update();		
	};

	this.OnFire = function(socket)
	{
		if(!canfire(socket.id))
			return;

		var curTank = getCurrentTank(socket.id);
		var position = curTank.getMissilePosition();
		var missile = new BTMissile(position.x, position.y, socket.id, curTank.direction);
		missiles.push(missile);
		update();
	};

};

module.exports = BTRoom;

var config = require('../config.js');
var BTBoundingBox = require("./bTBoundingBox.js");
var BTObject = require("./btobject.js");

var BTMissile = function (x, y, id, direction) {
	BTObject.call(this,'tankmissile.gif', 
		x, 
		y, 
		config.missile.width,
		config.missile.height);
	
	this.id = id;
	this.speed = config.missile.speed;
	this.hit = false;

	// 0, Left
	// 1, Right
	// 2, Up
	// 3, Down
	this.direction = direction;
};

BTMissile.prototype = new BTObject();

BTMissile.prototype.move = function(p1Tank, p2Tank, walls) {
	switch(this.direction) {
		case 0:
			this.x -= this.speed;
			break;
		case 1:
			this.x += this.speed;
			break;
		case 2:
			this.y -= this.speed;
			break;
		case 3:
			this.y += this.speed;
			break;
		default:
			// code
	}

	var enemyTank =p1Tank;
	if(this.id == p1Tank.id)
		enemyTank = p2Tank;

	var currentBoundary = this.getBoundingBox();
	if(enemyTank !== null)
	{
		var enemyTankBoundary = enemyTank.getBoundingBox();		
		if(currentBoundary.IsCollision(enemyTankBoundary))
		{
			this.hit = true;
			enemyTank.Hited();
			return;
		}
	}	

	for(var index = 0; index < walls.length; index++)
	{
		var wallBoundary = walls[index].getBoundingBox();
		if(currentBoundary.IsCollision(wallBoundary))
		{
			this.hit = true;
			walls.splice(index,1);
			return;			
		}
	}
};

BTMissile.prototype.isValid = function() {
	return (this.x >= 0 &&
			this.x <= config.screen.width &&
			this.y >= 0 &&
			this.y <= config.screen.height &&
			this.hit === false);
};

module.exports = BTMissile;

var config = require('../config.js');
var BTBoundingBox = require("./bTBoundingBox.js");

var BTMissile = function (x, y, id, direction) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.speed = config.missile.speed;
	this.width = config.missile.width;
	this.height = config.missile.height;
	this.resource = 'tankmissile.gif';
	this.hit = false;

	// 0, Left
	// 1, Right
	// 2, Up
	// 3, Down
	this.direction = direction;
};

BTMissile.prototype.move = function(p1Tank, p2Tank) {
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

	var enemyTankBoundary = enemyTank.getBoundingBox();
	var currentBoundary = this.getBoundingBox();
	if(currentBoundary.IsCollision(enemyTankBoundary))
	{
		this.hit = true;
		enemyTank.Hited();
	}
};

BTMissile.prototype.isValid = function() {
	return (this.x >= 0 &&
			this.x <= config.screen.width &&
			this.y >= 0 &&
			this.y <= config.screen.height &&
			this.hit == false);
};

BTMissile.prototype.getBoundingBox = function() {
	var result = new BTBoundingBox();
	result.left = this.x;
	result.top = this.y;
	result.right = this.x + this.width;
	result.bottom = this.y + this.height;
	return result;
};

module.exports = BTMissile;

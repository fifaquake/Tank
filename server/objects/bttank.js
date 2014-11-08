var config = require("../config.js");

var BTTank = function(upRes, downRes, leftRes, rightRes, id) {
	this.speed = config.player.speed;
	this.upResource = upRes;
	this.downResource = downRes;
	this.leftResource = leftRes;
	this.rightResource = rightRes;
	this.resource = this.upResource;

	this.x = Math.floor(Math.random() * config.screen.width);
	this.y = Math.floor(Math.random() * config.screen.height);

	this.id = id;
	this.width = config.player.width;
	this.height = config.player.height;
	this.direction = config.player.direction;
};

BTTank.prototype.moveUp = function() {
	this.y -= this.speed;
	this.resource = this.upResource;
	this.direction = 2;

	// boundary check
	if(this.y <= this.height / 2)
		this.y = this.height / 2;
};

BTTank.prototype.moveDown = function () {
	this.y += this.speed;
	this.resource =this.downResource;
	this.direction = 3;

	// boundary check
	if(this.y > config.screen.height - this.height/2)
		this.y = config.screen.height -this.height/2;
};

BTTank.prototype.moveLeft = function(btObjects) {
	this.resource =this.leftResource;
	this.direction = 0;
	this.x -= this.speed;

	var tanks = btObjects.Tanks;
	for (var i = 0; i < tanks.length; i++) {
		if (this.IsCollision(tanks[i])) {
			this.x = tanks[i].getBoundaryBox().right;
		}
	}

	// boundary check
	if(this.x <=this.width/2)
		this.x =this.width/2;
};

BTTank.prototype.moveRight = function (btObjects) {
	this.resource = this.rightResource;
	this.direction = 1;
	this.x += this.speed;

	var tanks = btObjects.Tanks;

	for (var i = 0; i < tanks.length; i++) {
		if (this.IsCollision(tanks[i])) {
			this.x = tanks[i].x - tanks[i].width;
		}
	};

	if(this.x >= config.screen.width -this.width/2)
		this.x = config.screen.width -this.width/2;
};

BTTank.prototype.getMissilePosition = function () {

	// ? Is this caused by we set the anchor for the tank in the client?
	var centerX = this.x; // + this.width / 2;
	var centerY = this.y; // + this.height / 2;

	var missileX = 0;
	var missileY = 0;

	switch(this.direction) {
		case 0: 
			//left 
			missileX = centerX - this.width / 2;
			missileY = centerY;
			break;
		case 1:
			// right
			missileX = centerX + this.width / 2;
			missileY = centerY;
			break;
		case 2:
			missileX = centerX;
			missileY = centerY - this.height / 2;
			break;
		case 3:
			missileX = centerX;
			missileY = centerY + this.height / 2;
			break;
		default:
			// code
	}

	return {'x' : missileX, 'y' : missileY};
};

BTTank.prototype.getBoundaryBox = function() {
	return {
		"left" : this.x,
		"top" : this.y,
		"right" : this.x + config.player.width,
		"bottom" : this.y + config.player.height,
	};
};

BTTank.prototype.IsCollision = function(tank) {
	var ownBoundary = this.getBoundaryBox();
	var otherBoundary = tank.getBoundaryBox();

	return !(otherBoundary.left > ownBoundary.right ||
			otherBoundary.right < ownBoundary.left ||
			otherBoundary.top > ownBoundary.bottom ||
			otherBoundary.bottom < ownBoundary.top)
}

module.exports = BTTank;

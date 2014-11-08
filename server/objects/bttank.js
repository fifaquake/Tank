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
	// set the correct resource and direction
	this.resource =this.leftResource;
	this.direction = 0;

	// check whether the left move will cause collision.
	var tanks = btObjects.Tanks;
	var minimunMove = this.speed;
	for (var i = 0; i < tanks.length; i++) {
		var curMovement = this.speed;
		if (this.canMoveLeft(tanks[i])) {
			// in case that the distance between the two tanks is little than the speed.
			curMovement = this.getBoundaryBox().left - tanks[i].getBoundaryBox().right;
			if (curMovement >= 0 && curMovement < minimunMove) {
				minimunMove = curMovement;
			}
		}
		else {
			minimunMove = 0;
		}
	}

	if (minimunMove > 0) {
		this.x -= this.speed;

		// boundary check
		if(this.x <=this.width/2)
		this.x =this.width/2;
	}
};

BTTank.prototype.canMoveLeft = function(tank) {
	var ownBoundary = this.getBoundaryBox();
	var otherBoundary = tank.getBoundaryBox();

	console.log("own left :" + ownBoundary.left + " own right :"  + ownBoundary.right);
	console.log("other left :" + otherBoundary.left + " other right :" +  otherBoundary.right);

	return (ownBoundary.left >= otherBoundary.right || ownBoundary.right <= otherBoundary.left);
};

BTTank.prototype.moveRight = function () {
	this.resource = this.rightResource;
	this.x =this.x + this.speed;
	this.direction = 1;
	// boundary check
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

BTTank.prototype.IsCrash = function(tank) {
    return ((this.x - tank.x) < (this.width + tank.width) / 2) &&
		   ((this.y - tank.y) < (this.height + tank.height)/2);
};


module.exports = BTTank;

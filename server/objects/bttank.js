var config = require("../config.js");
var BTBoundingBox = require("./bTBoundingBox.js");
var BTObject = require("./btobject.js");
var BTHP = require("./bthp.js");

var BTTank = function(player, id) {

	if(player == 1)
	{
		this.upResource = 'p1tankU.gif';
		this.downResource = 'p1tankD.gif';
		this.leftResource = 'p1tankL.gif';
		this.rightResource = 'p1tankR.gif';
		this.BTHPs = [];
		for(var i = 0; i < 10; i++)
		{
			this.BTHPs.push(new BTHP(i));
		}
		
	}
	else
	{
		this.upResource = 'p2tankU.gif';
		this.downResource = 'p2tankD.gif';
		this.leftResource = 'p2tankL.gif';
		this.rightResource = 'p2tankR.gif';
		this.BTHPs=[];
		for(var j = 46; j > 36; j--)
		{
			this.BTHPs.push(new BTHP(j));
		}
	}

	this.id = id;
	this.speed = config.player.speed;
	this.direction = config.player.direction;	

	BTObject.call(this, this.upResource,
	Math.floor(Math.random() * config.screen.width),
	Math.floor(Math.random() * config.screen.height),
	config.player.width,
	config.player.height);
};

BTTank.prototype = new BTObject();

BTTank.prototype.moveUp = function(btObjects) {
	this.y -= this.speed;
	this.resource = this.upResource;
	this.direction = 2;

	for (var i = 0; i < btObjects.length; i++) {
		if (this.IsCollision(btObjects[i])) {
			this.y = btObjects[i].getBoundingBox().bottom;
			break;
		}
	}

	// boundary check
	if(this.y <= this.height / 2)
		this.y = this.height / 2;
};

BTTank.prototype.moveDown = function (btObjects) {
	this.y += this.speed;
	this.resource =this.downResource;
	this.direction = 3;

	for (var i = 0; i < btObjects.length; i++) {
		if (this.IsCollision(btObjects[i])) {
			this.y = btObjects[i].y - btObjects[i].height;
			break;
		}
	}

	// boundary check
	if(this.y > config.screen.height - this.height/2)
		this.y = config.screen.height -this.height/2;
};

BTTank.prototype.moveLeft = function(btObjects) {
	this.resource =this.leftResource;
	this.direction = 0;
	this.x -= this.speed;

	for (var i = 0; i < btObjects.length; i++) {
		if (this.IsCollision(btObjects[i])) {
			this.x = btObjects[i].getBoundingBox().right;
			break;
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

	for (var i = 0; i < btObjects.length; i++) {
		if (this.IsCollision(btObjects[i])) {
			this.x = btObjects[i].x - btObjects[i].width;
			break;
		}
	}

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

BTTank.prototype.Hited = function() {
	this.BTHPs.pop();
	if(!this.IsAlive()) {
		this.resource = "blast4.gif";//move to config
		setTimeout(this.ReBirth(this), 5000);
	}
};

BTTank.prototype.IsAlive = function() {
	return this.BTHPs.length > 0;
};

BTTank.prototype.ReBirth = function(tank) {
	if (tank.upResource === 'p1tankU.gif') {
		tank.BTHPs = [];
		for(var i = 0; i < 10; i++)
		{
			tank.BTHPs.push(new BTHP(i));
		}

	} else {
		tank.BTHPs = [];
		for(var j = 46; j > 36; j--)
		{
			tank.BTHPs.push(new BTHP(j));
		}
	}
	tank.resource = tank.upResource;
	tank.x = Math.floor(Math.random() * config.screen.width);
	tank.y = Math.floor(Math.random() * config.screen.height);
};

module.exports = BTTank;

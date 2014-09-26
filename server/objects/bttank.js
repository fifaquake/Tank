var BTTank = function(upRes, downRes, leftRes, rightRes, id) {
	
	this.upResource = upRes;
	this.downResource = downRes;
	this.leftResource = leftRes;
	this.rightResource = rightRes;
	this.resource = this.upResource;

	this.x = Math.floor(Math.random() * 800);
	this.y = Math.floor(Math.random() * 600);

	this.id = id;
	this.width = 60;
	this.height = 60;
	this.direction = 2;
};

BTTank.prototype.moveUp = function() {
	this.y -= 10;
	this.resource = this.upResource;
	this.direction = 2;

	// boundary check
	if(this.y <= this.height / 2)
		this.y = this.height / 2;
};

BTTank.prototype.moveDown = function () {
	this.y += 10;
	this.resource =this.downResource;
	this.direction = 3;

	// boundary check
	if(this.y > 600 -this.height/2)
		this.y = 600-this.height/2;
};

BTTank.prototype.moveLeft = function() {
	this.x -= 10;

	this.resource =this.leftResource;
	this.direction = 0;
	// boundary check
	if(this.x <=this.width/2)
		this.x =this.width/2;
};

BTTank.prototype.moveRight = function () {
	this.resource = this.rightResource;
	this.x =this.x + 10;
	this.direction = 1;
	// boundary check
	if(this.x >= 800 -this.width/2)
		this.x = 800-this.width/2;
};

BTTank.prototype.getMissilePosition = function () {
	var centerX = this.x + this.width / 2;
	var centerY = this.y + this.height / 2;

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

BTTank.prototype.IsCrash = function(tank) {
    return ((this.x - tank.x) < (this.width + tank.width) / 2) &&
		   ((this.y - tank.y) < (this.height + tank.height)/2);
};

module.exports = BTTank;

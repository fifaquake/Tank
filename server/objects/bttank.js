var BTTank = function(upRes, downRes, leftRes, rightRes, x, y, id) {
	
	this.upResource = upRes;
	this.downResource = downRes;
	this.leftResource = leftRes;
	this.rightResource = rightRes;
	this.resource = this.upResource;

	this.x = x;
	this.y = y;
	this.id = id;
	this.width = 60;
	this.height = 60;
}

BTTank.prototype.moveUp = function() {
	this.y -= 10;
	this.resource = this.upResource;

	// boundary check
	if(this.y <= this.height / 2)
		this.y = this.height / 2;
}

BTTank.prototype.moveDown = function () {
	this.y += 10;
	this.resource =this.downResource;

	// boundary check
	if(this.y > 600 -this.height/2)
		this.y = 600-this.height/2;
}

BTTank.prototype.moveLeft = function() {
	this.x -= 10;

	this.resource =this.leftResource;
	// boundary check
	if(this.x <=this.width/2)
		this.x =this.width/2;
}

BTTank.prototype.moveRight = function () {
	this.resource = this.rightResource;
	this.x =this.x + 10;
	// boundary check
	if(this.x >= 800 -this.width/2)
		this.x = 800-this.width/2;
}
module.exports = BTTank;

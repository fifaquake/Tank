var BTTank = function(upRes, downRes, leftRes, rightRes, x, y, id) {
	
	this.upResource = upRes;
	this.downResource = downRes;
	this.leftResource = leftRes;
	this.rightResource = rightRes;
	this.resource = this.upResource;

	this.x = x;
	this.y = y;
	this.width = 60;
	this.height = 60;
	this.id = id;
}

module.exports = BTTank;

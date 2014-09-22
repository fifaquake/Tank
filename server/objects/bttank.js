var BTTank = function(upRes, downRes, leftRes, rightRes, x, y, id) {
	
	this.upResource = upRes;
	this.downResource = downRes;
	this.leftResource = leftRes;
	this.rightResource = rightRes;
	this.resource = this.upResource;

	this.x = x;
	this.y = y;
<<<<<<< HEAD
	this.width = 60;
	this.height = 60;
=======
	this.id = id;
>>>>>>> fcb46c02d61e30e8d31c361fb31bfb9c75ad06aa
}

module.exports = BTTank;

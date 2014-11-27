var BTBoundingBox = require("./bTBoundingBox.js");

var BTObject = function(res, x, y, width, height) {
	this.resource = res;	
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

BTObject.prototype.getBoundingBox = function() {
	var result = new BTBoundingBox();
	result.left = this.x;
	result.top = this.y;
	result.right = this.x + this.width;
	result.bottom = this.y + this.height;
	return result;
};

BTObject.prototype.IsCollision = function(other) {
	var ownBoundary = this.getBoundingBox();
	var otherBoundary = other.getBoundingBox();
	return ownBoundary.IsCollision(otherBoundary);
};

module.exports = BTObject;
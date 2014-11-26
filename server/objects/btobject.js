var BTBoundingBox = require("./bTBoundingBox.js");

var BTObject = function() {
	this.resource = null;	
	this.x = 0
	this.y = 0
	this.width = 0;
	this.height = 0;
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
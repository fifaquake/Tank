var BTBoundingBox = function() {
	this.left = 0;
	this.top = 0;
	this.right = 0;
	this.top = 0;
};

BTBoundingBox.prototype.IsCollision = function(other) {
	
	return !(this.left >= other.right ||
			this.right <= other.left ||
			this.top >= other.bottom ||
			this.bottom <= other.top);
};

module.exports = BTBoundingBox;

var clientConfig = require('../clientconfig.js');

var BTMissile = function (x, y, id, direction) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.speed = 15;
	this.resource = 'tankmissile.gif';

	// 0, Left
	// 1, Right
	// 2, Up
	// 3, Down
	this.direction = direction;
};

BTMissile.prototype.move = function() {
	switch(this.direction) {
		case 0:
			this.x -= this.speed;
			break;
		case 1:
			this.x += this.speed;
			break;
		case 2:
			this.y -= this.speed;
			break;
		case 3:
			this.y += this.speed;
			break;
		default:
			// code
	}
};

BTMissile.prototype.isValid = function() {
	return (this.x >= 0 &&
			this.x <= clientConfig.clientWidth &&
			this.y >= 0 &&
			this.y <= clientConfig.clientHeight);
};

module.exports = BTMissile;

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

module.exports = BTMissile;

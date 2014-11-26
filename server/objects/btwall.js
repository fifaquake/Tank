var config = require("../config.js");
var BTBoundingBox = require("./bTBoundingBox.js");
var BTObject = require("./btobject.js");

var BTWall = function (x, y) {
	this.x = x*config.wall.width;
	this.y = y*config.wall.height;
	this.width = config.wall.width;
	this.height = config.wall.height;
	this.resource = 'walls.gif';
};

BTWall.prototype = new BTObject();

module.exports = BTWall;
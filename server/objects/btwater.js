var config = require("../config.js");
var BTBoundingBox = require("./bTBoundingBox.js");
var BTObject = require("./btobject.js");

var BTWater = function (x, y) {
	BTObject.call(this, 'water.gif',
		x*config.sceneObject.width + config.sceneObject.width/2,
		y*config.sceneObject.height+ config.sceneObject.height/2,
		config.sceneObject.width,
		config.sceneObject.height);
};

BTWater.prototype = new BTObject();

module.exports = BTWater;
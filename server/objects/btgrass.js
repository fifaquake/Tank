var config = require("../config.js");
var BTBoundingBox = require("./bTBoundingBox.js");
var BTObject = require("./btobject.js");

var BTGrass = function (x, y) {
	BTObject.call(this, 'grass.gif',
		x*config.sceneObject.width + config.sceneObject.width/2,
		y*config.sceneObject.height+ config.sceneObject.height/2,
		config.sceneObject.width,
		config.sceneObject.height);
};

BTGrass.prototype = new BTObject();

module.exports = BTGrass;
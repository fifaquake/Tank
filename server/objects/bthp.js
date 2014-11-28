var config = require("../config.js");
var BTBoundingBox = require("./bTBoundingBox.js");
var BTObject = require("./btobject.js");

var BTHP = function (x) {
	BTObject.call(
		this,
		'heart.png',
		x*config.hp.width + config.hp.width,
		config.hp.height,
		config.hp.width,
		config.hp.height);
};

BTHP.prototype = new BTObject();

module.exports = BTHP;
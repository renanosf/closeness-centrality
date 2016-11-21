"use strict";

var fs = require("fs");
var Closeness = require("./lib/closeness.js");

fs.readFile("./edges.txt", "utf8", function(err, res) {
	if (err) {
		console.log(err);
	} else {
		var closeness = Closeness.getCloseness(res);
		console.log(closeness);
	}
});

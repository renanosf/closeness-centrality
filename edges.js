"use strict";

var fs = require("fs");
var argv = require("yargs").argv;
var Closeness = require("./lib/closeness.js");

if (typeof argv.file === "string") {
	// Read edges file and calculate users closeness
	fs.readFile(argv.file, "utf8", function(err, res) {
		if (err) {
			console.log(err);
		} else {
			var closeness = Closeness.getCloseness(res);
			console.log(closeness);
		}
	});
} else {
	console.log("Provide --file parameter.");
}

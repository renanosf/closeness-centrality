"use strict";

// Basic Express server
var express = require("express");
var bodyParser = require("body-parser");
var Closeness = require("./lib/closeness.js");

var app = express();

// JSON middleware and serve static folder - public
app.use(bodyParser.json({limit: "102400kb"}));
app.use(express.static("public"));

// Receive edges string from facebook page and return closeness
app.post("/edges", function(req, res) {
	var closeness = Closeness.getCloseness(req.body.file);
	res.json({info: closeness});
});

app.listen(3000, function() {
	console.log("Express is running on port 3000");
});

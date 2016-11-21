"use strict";

var Graph = require("./graph.js");

var Closeness = (function() {

	var map = {};
	var graph = null;
	var closeness = [];

	var mapEdges = function(str) {
		var lines = str.split("\n");
		for (var i = 0; i < lines.length; i++) {
			var ids = lines[i].split(" ");
			if (typeof map[ids[0]] === "undefined") {
				map[ids[0]] = {};
			}
			if (typeof map[ids[1]] === "undefined") {
				map[ids[1]] = {};
			}
			map[ids[0]][ids[1]] = 1;
			map[ids[1]][ids[0]] = 1;
		}
	};

	var initGraph = function() {
		graph = new Graph(map);
	};

	var findCloseness = function() {
		for (var key in map) {
			if (map.hasOwnProperty(key)) {
				var count = 0;
				var total = 0;
				for (var insideKey in map) {
					if (map.hasOwnProperty(insideKey) && insideKey !== key) {
						count++;
						var res = graph.findShortestPath(key, insideKey);
						total += res.length - 1;
					}
				}
				var avg = total / count;
				var c = 1 / avg;
				closeness.push({id: key, value: c});
			}
		}

		closeness.sort(function(a, b) {
			return b.value - a.value;
		});
	};

	return {
		getCloseness: function(str) {
			mapEdges(str);
			initGraph();
			findCloseness();
			return closeness;
		}
	};

}());

module.exports = Closeness;

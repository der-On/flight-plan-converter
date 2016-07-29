'use strict';

var types = require('../types');
var removeDuplicateWhitespace = require('../utils/removeDuplicateWhitespace');
var removeEmptyLines = require('../utils/removeEmptyLines');
var normalizeLineBreaks = require('../utils/normalizeLineBreaks');

var typeMap = {
  1: types.AIRPORT,
  2: types.NDB,
  3: types.VOR,
  11: types.FIX,
  28: types.GPS
};

function waypointFromLine(line) {
  var waypoint = {};
  var parts = line.split(' ');
  var lineCode = parts[0];

  var type = typeMap[lineCode] || types.GPS;
  waypoint.type = type;

  switch(type) {
    case types.GPS:
      waypoint.elevation = parseFloat(parts[1]);
      waypoint.lat = parseFloat(parts[2]);
      waypoint.lon = parseFloat(parts[3]);
      break;
    case types.AIRPORT:
    case types.FIX:
    case types.NDB:
    case types.VOR:
      waypoint.elevation = parseFloat(parts[2]);
      waypoint.lat = parseFloat(parts[3]);
      waypoint.lon = parseFloat(parts[4]);
      break;
  }

  switch(type) {
    case types.AIRPORT:
      waypoint.airport = {
        icao: parts[1]
      };
      break;
    case types.NDB:
    case types.VOR:
      waypoint[type] = {
        identifier: parts[1]
      };
      break;
    case types.FIX:
      waypoint.fix = {
        name: parts[1]
      };
      break;
  }

  return waypoint;
}

/**
 * Converts XPlanes fms flight plan to normalized flight plan
 * @param  {String} flightPlan FMS flight plan
 * @return {Object}            normalized flight plan
 */
module.exports = function (input) {
  var fpl = {
    waypoints: []
  };

  // remove empty lines
  // and normalize line breaks to unix style
  input = normalizeLineBreaks(removeEmptyLines(input));
  input
    .split('\n')
     // skip first 4 lines, as they contain the header
    .slice(4)
    .forEach(parseLine)

  function parseLine(line) {
    line = removeDuplicateWhitespace(line).trim();

    // ignore lines containing no usefull information
    if (line.split(' ').length < 2) return;

    try {
      fpl.waypoints.push(waypointFromLine(line));
    } catch(error) {
      console.error(error);
    }
  }

  return fpl;
};

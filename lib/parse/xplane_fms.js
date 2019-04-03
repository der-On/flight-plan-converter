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
  28: types.GPS,
  9999: types.ERROR
};

var fmsVersion = 3;

function waypointFromLine(line) {
  var waypoint = {};
  var parts = line.split(' ');
  var lineCode = parts[0];

  var type = typeMap[lineCode] || types.ERROR;
  waypoint.type = type;

  var addIdx = 0;

  switch(type) {
    case types.GPS:
      (fmsVersion === '3'? addIdx=0: addIdx=2)
      waypoint.elevation = parseFloat(parts[1+addIdx]);
      waypoint.lat = parseFloat(parts[2+addIdx]);
      waypoint.lon = parseFloat(parts[3+addIdx]);
      break;
    case types.AIRPORT:
    case types.FIX:
    case types.NDB:
    case types.VOR:
      (fmsVersion === '3'? addIdx=0: addIdx=1)
      waypoint.elevation = parseFloat(parts[2+addIdx]);
      waypoint.lat = parseFloat(parts[3+addIdx]);
      waypoint.lon = parseFloat(parts[4+addIdx]);
      break;
    case types.ERROR:
      return null;
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
  fmsVersion = input.split('\n')[1].split(' ')[0];

  // If v1100 we need to locate the NUMER code
  var offset = (fmsVersion === '1100' ? input.split('\n').findIndex(line => line.indexOf('NUMENR') != -1) +1 : 4 );
  input
    .split('\n')
     // skip first 4 lines, as they contain the header
    .slice(offset)
    .forEach(parseLine)

  function parseLine(line) {
    line = removeDuplicateWhitespace(line).trim();

    // ignore lines containing no usefull information
    if (line.split(' ').length < 2) return;

    // Check V1100 includes more lines with information before NUMER

    try {
      fpl.waypoints.push(waypointFromLine(line));
    } catch(error) {
      console.error(error);
    }
  }

  return fpl;
};

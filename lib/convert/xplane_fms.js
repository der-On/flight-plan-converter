'use strict';

var types = require('../types');

var typeMap = {
  'airport': 1,
  'ndb': 2,
  'vor': 3,
  'fix': 11,
  'gps': 28
};

function lineFromWaypoint(waypoint) {
  var line = [typeMap[waypoint.type] || typeMap[types.GPS]];

  switch(waypoint.type) {
    case types.AIRPORT:
      line.push(waypoint.airport.icao);
      break;
    case types.NDB:
    case types.VOR:
      line.push(waypoint[waypoint.type].identifier);
      break;
    case types.FIX:
      line.push(waypoint.fix.name);
      break;
  }

  line.push(waypoint.elevation);
  line.push(waypoint.lat);
  line.push(waypoint.lon);

  return line.join(' ');
}

/**
 * Converts normalized flight plan to XPlanes fms format
 * @param  {Object} flightPlan normalized flight plan
 * @return {String}            FMS flight plan
 */
module.exports = function (flightPlan) {
  return [
    'I',
    '3 version',
    '1',
    flightPlan.waypoints.length
  ]
    .concat(
      flightPlan
        .waypoints
        .map(lineFromWaypoint)
    )
    .join('\r\n');
};

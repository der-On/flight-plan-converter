'use strict';

var types = require('../types');
var typeMap = require('../typeMap');
var reverseTypeMap = Object.keys( typeMap ).reduce( ( r, k ) => ( { ...r, ...k && typeMap[ k ] && { [ typeMap[ k ] ]: k } } ), {} )

function getWaypointName( waypoint ) {
  switch( waypoint.type ) {
    case types.AIRPORT:
      return waypoint.airport.icao
      break;
    case types.NDB:
    case types.VOR:
      return waypoint[waypoint.type].identifier
      break;
    case types.FIX:
      return waypoint.fix.name
      break;
    case types.GPS:
    default:
      return waypoint.identifier || 'NONAME'
      break
  }
}

function lineFromWaypoint(waypoint, index, length, fmsVersion) {
  var line = [reverseTypeMap[waypoint.type] || reverseTypeMap[types.GPS]];

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
    case types.GPS:
    default:
      // FMS takes all five entries per line, even for older v3 version, so should consider adding it even without v1100
      // (leaving out to avoid intruding on anyone's compatbility)
      // And most parsers allow the identifier here for locations (instead of weird +000_-000), including X-Plane
      if( fmsVersion === '1100' ) {
        line.push( waypoint.identifier || 'NONAME' )
      }
      break
  }

  if( fmsVersion === '1100' ) {
    // v1100 needs VIA entry, using direct for enroute segments for now (except for departing and arriving airports)
    let via
    if( waypoint.type === types.AIRPORT && index === 0 ) {
      via = 'ADEP'
    } else if( waypoint.type === types.AIRPORT && index === length - 1 ) {
      via = 'ADES'
    } else {
      via = 'DRCT'
    }
    line.push( via )
  }

  line.push(waypoint.elevation);
  line.push(waypoint.lat);
  line.push(waypoint.lon);

  return line.join(' ');
}

function getV3Header( flightPlan ) {
  return [
    'I',
    '3 version',
    '1',
    flightPlan.waypoints.length
  ]
}

function getDeX( suffix, waypoint ) {
  const name = getWaypointName( waypoint )
  const line = waypoint.type === types.AIRPORT ? `A${suffix} ${name}` : `${suffix} ${name}`
  return line
}

function getV1100Header( flightPlan ) {
  const dep = getDeX( 'DEP', flightPlan.waypoints[ 0 ] )
  const des = getDeX( 'DES', flightPlan.waypoints[ flightPlan.waypoints.length - 1 ] )
  return [
    'I',
    '1100 version',
    'CYCLE 1708', // could get real AIRAC cycle, using this for now just to match X-Plane
    dep,
    des,
    `NUMENR ${flightPlan.waypoints.length}`
  ]
}

/**
 * Converts normalized flight plan to XPlanes fms format
 * @param  {Object} flightPlan normalized flight plan
 * @return {String}            FMS flight plan
 */
module.exports = function (flightPlan, options = {}) {
  const { fmsVersion } = options
  const header = fmsVersion === '1100' ? getV1100Header( flightPlan) : getV3Header( flightPlan )
  return header
    .concat(
      flightPlan
        .waypoints
        .map( ( wp, i ) => lineFromWaypoint( wp, i, flightPlan.waypoints.length, fmsVersion ))
    )
    .join('\r\n');
};

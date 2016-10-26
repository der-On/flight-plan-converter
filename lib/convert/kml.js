'use strict';

var types = require('../types');

var typeMap = {
  'airport': 1,
  'ndb': 2,
  'vor': 3,
  'fix': 11,
  'gps': 28
};

var mtPerFt = 0.305;

function ftToMt(ft) {
  return ft * mtPerFt;
}

function formatNumber(n) {
  return (Math.round(n * 1000) / 1000).toString();
}

function waypointName(waypoint) {
  switch(waypoint.type) {
    case types.AIRPORT:
      return waypoint.airport.icao;
      break;
    case types.FIX:
      return waypoint.fix.name;
      break;
    case types.VOR:
    case types.NDB:
      return waypoint[waypoint.type].identifier;
      break;
  }

  return formatNumber(waypoint.lat) + ', ' + formatNumber(waypoint.lon);
}

function placemarkFromWaypoint(waypoint) {
  return [
    '      <Placemark>',
    '        <name>' + waypoint.type + ': ' + waypointName(waypoint) + '</name>',
    '        <Point>',
    '          <altitudeMode>absolute</altitudeMode>',
    '          <coordinates>' + coordinatesFromWaypoint(waypoint) + '</coordinates>',
    '        </Point>',
    '      </Placemark>'
  ].join('\r\n');
}

function coordinatesFromWaypoint(waypoint) {
  return [waypoint.lon, waypoint.lat, ftToMt(waypoint.elevation)].join(',');
}

/**
 * Converts normalized flight plan to XPlanes fms format
 * @param  {Object} flightPlan normalized flight plan
 * @return {String}            FMS flight plan
 */
module.exports = function (flightPlan) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<kml xmlns="http://www.opengis.net/kml/2.2">',
    '  <Document>',
    '    <name>' + (flightPlan.title || 'Flight Plan') + '</name>',
    '    <Style id="waypoint">',
    '      <IconStyle>',
    '        <Icon>',
    '          <href>http://maps.google.com/mapfiles/kml/pal4/icon28.png</href>',
    '        </Icon>',
    '      </IconStyle>',
    '      <LineStyle>',
    '        <width>2</width>',
    '        <color>7fff00ff</color>',
    '      </LineStyle>',
    '    </Style>',
    '    <Folder>',
    '      <name>Waypoints</name>',
    '      <styleUrl>#waypoint</styleUrl>'
    ]
    .concat(
      flightPlan
        .waypoints
        .map(placemarkFromWaypoint)
    )
    .concat([
    '    </Folder>',
    '    <Folder>',
    '      <name>Flight path</name>',
    '      <styleUrl>#waypoint</styleUrl>',
    '      <Placemark>',
    '        <LineString>',
    '          <altitudeMode>absolute</altitudeMode>',
    '          <coordinates>',
    '            ' + flightPlan
                      .waypoints
                      .map(coordinatesFromWaypoint)
                      .join('\r\n            '),
    '          </coordinates>',
    '        </LineString>',
    '      </Placemark>',
    '    </Folder>',
    '  </Document>',
    '</kml>'
  ]).join('\r\n');
};

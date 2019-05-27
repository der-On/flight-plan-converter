'use strict';

// input and output file name suffixes for each format

const types = require( './formatTypes' )
const { FPL } = types

module.exports = {
  XPLANE_FMS: 'fms',
  KML: 'kml',
  [ FPL ]: 'fpl'
};

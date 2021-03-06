'use strict';

// module file names for converters and parsers

const types = require( './formatTypes' )
const { FPL } = types

module.exports = {
  XPLANE_FMS: 'xplane_fms',
  KML: 'kml',
  [ FPL ]: 'fpl'
};

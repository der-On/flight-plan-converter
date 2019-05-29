'use strict';

const formatTypes  = require( '../formatTypes' )
const { FPL } = formatTypes 

var parsers = {
  xplane_fms: require('./xplane_fms'),
  [ FPL ]: require( './fpl' )
};

/**
 * Converts source flight plan to normalized flight plan
 * @param  {String} flightPlan source fligh tplan
 * @param  {string} format target format
 * @return {Object}        normalized flight plan
 */
module.exports = function (input, format) {
  var parser = parsers[format] || null;

  if (!parser) {
    throw new Error('Unsupported format: "' + format + '"');
  }

  return parser(input);
};

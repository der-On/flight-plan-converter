'use strict';

var converters = {
  xplane_fms: require('./xplane_fms'),
  kml: require('./kml')
};

/**
 * Converts normalized flight plan to target format
 * @param  {Object} flightPlan normalized flight plan
 * @param  {string} format target format
 * @return {String}        Converted flight plan
 */
module.exports = function (flightPlan, format, options) {
  var converter = converters[format] || null;

  if (!converter) {
    throw new Error('Unsupported format: "' + format + '"');
  }

  return converter(flightPlan, options);
};

'use strict';

module.exports = function normalizeLineBreaks (str) {
  return str.replace(/(\r\n|\r|\n)/gm, '\r\n');
};

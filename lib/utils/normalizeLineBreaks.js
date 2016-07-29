'use strict';

module.exports = function normalizeLineBreaks (str) {
  return str.replace(/(\r\n|\r)/gm, '\n');
};

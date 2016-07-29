'use strict';

module.exports = function removeEmptyLines (str) {
  return str.replace(/^\s*[\r\n]/gm, '');
};

'use strict';

module.exports = function removeDuplicateWhitespace (str) {
  return str.replace(/\s+/g, " ");
};

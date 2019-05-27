'use strict';

const {
	AIRPORT,
	NDB,
	VOR,
	FIX,
	GPS,
	ERROR
} = require('./types');

module.exports = {
  1: AIRPORT,
  2: NDB,
  3: VOR,
  11: FIX,
  28: GPS,
  9999: ERROR
};

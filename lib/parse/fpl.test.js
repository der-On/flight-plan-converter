'use strict';

var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var parser = require('./fpl');
var normalizeLineBreaks = require('../utils/normalizeLineBreaks');

function getFms(filename) {
  return normalizeLineBreaks(fs.readFileSync(
    path.join(__dirname, '../../fixtures/fpl/' + filename),
    'utf8'
  ));
}

function getFlightPlan(filename) {
  return require('../../fixtures/normalized/' + filename);
}

describe('parse/fpl', () => {
  it('should parse sample.fpl', () => {
    expect(parser(getFms('sample.fpl')))
      .to
      .eql(getFlightPlan('sample.json'));
  });
});

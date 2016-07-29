'use strict';

var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var converter = require('./kml');
var normalizeLineBreaks = require('../utils/normalizeLineBreaks');

function getKml(filename) {
  return normalizeLineBreaks(fs.readFileSync(
    path.join(__dirname, '../../fixtures/kml/' + filename),
    'utf8'
  ).trim());
}

function getFlightPlan(filename) {
  return require('../../fixtures/normalized/' + filename);
}

describe('convert/kml', () => {
  it('should convert simple.json', () => {
    console.log(converter(getFlightPlan('simple.json')));
    expect(converter(getFlightPlan('simple.json')))
      .to
      .eql(getKml('simple.kml'));
  });
});

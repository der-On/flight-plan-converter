'use strict';

var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var converter = require('./xplane_fms');
var normalizeLineBreaks = require('../utils/normalizeLineBreaks');

function getFms(filename) {
  return normalizeLineBreaks(fs.readFileSync(
    path.join(__dirname, '../../fixtures/xplane_fms/' + filename),
    'utf8'
  ).trim());
}

function getFlightPlan(filename) {
  return require('../../fixtures/normalized/' + filename);
}

describe('convert/xplane_fms', () => {
  it('should convert simple.json', () => {
    expect(converter(getFlightPlan('simple.json')))
      .to
      .eql(getFms('simple.fms'));
  });

  it('should convert gps.json', () => {
    expect(converter(getFlightPlan('gps.json')))
      .to
      .eql(getFms('gps_cleaned.fms'));
  });

  it('should convert ndbs.json', () => {
    expect(converter(getFlightPlan('ndbs.json')))
      .to
      .eql(getFms('ndbs_cleaned.fms'));
  });

  it('should convert advanced.json', () => {
    expect(converter(getFlightPlan('advanced.json')))
      .to
      .eql(getFms('advanced_cleaned.fms'));
  });

  it('should convert complex.json', () => {
    expect(converter(getFlightPlan('complex.json')))
      .to
      .eql(getFms('complex_cleaned.fms'));
  });
});

'use strict';

var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var parser = require('./xplane_fms');

function getFms(filename) {
  return fs.readFileSync(
    path.join(__dirname, '../../fixtures/xplane_fms/' + filename),
    'utf8'
  );
}

function getFlightPlan(filename) {
  return require('../../fixtures/normalized/' + filename);
}

describe('parse/xplane_fms', () => {
  it('should parse simple.fms', () => {
    expect(parser(getFms('simple.fms')))
      .to
      .eql(getFlightPlan('simple.json'));
  });

  it('should parse gps.fms', () => {
    expect(parser(getFms('gps.fms')))
      .to
      .eql(getFlightPlan('gps.json'));
  });

  it('should parse ndbs.fms', () => {
    expect(parser(getFms('ndbs.fms')))
      .to
      .eql(getFlightPlan('ndbs.json'));
  });

  it('should parse advanced.fms', () => {
    expect(parser(getFms('advanced.fms')))
      .to
      .eql(getFlightPlan('advanced.json'));
  });

  it('should parse complex.fms', () => {
    expect(parser(getFms('complex.fms')))
      .to
      .eql(getFlightPlan('complex.json'));
  });
});

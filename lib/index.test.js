'use strict';

var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var converter = require('./index');
var formats = require('./formats');
var types = require('./types');
var normalizeLineBreaks = require('./utils/normalizeLineBreaks');

function getFlightPlan(filename) {
  return require('../fixtures/normalized/' + filename);
}

function getSource(filename) {
  return normalizeLineBreaks(fs.readFileSync(
    path.join(__dirname, '../fixtures/' + filename),
    'utf8'
  ).trim());
}

describe('converter', () => {
  it('should expose formats, types, convert and parse', () => {
    expect(converter.formats).to.be(formats);
    expect(converter.types).to.be(types);
    expect(converter.convert).to.be.a('function');
    expect(converter.parse).to.be.a('function');
  });

  it('should convert simple.json to xplane fms format', () => {
    expect(converter.convert(
      getFlightPlan('simple.json'),
      converter.formats.XPLANE_FMS
    ))
      .to
      .eql(getSource('xplane_fms/simple.fms'));
  });

  it('should parse xplane_fms/simple.fmx', () => {
    expect(converter.parse(
      getSource('xplane_fms/simple.fms'),
      converter.formats.XPLANE_FMS
    ))
      .to
      .eql(getFlightPlan('simple.json'));
  });
});

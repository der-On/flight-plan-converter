# Flight-Plan converter

[![Build Status](https://travis-ci.org/der-On/flight-plan-converter.svg?branch=master)](https://travis-ci.org/der-On/flight-plan-converter)

Converts Flight Plans from and to various file formats.


## Supported formats:

- [X-Planes](http://www.x-plane.com) `.fms` V3
- [X-Planes](http://www.x-plane.com) `.fms` V1100
- [ForeFlight](https://plan.foreflight.com) `.fpl` (import only)
- KML (export only)


## Usage

On the command line:

```bash
$ npm install
$ npm run convert [source] [dest]
```

or bypassing npm to use directly: 

```bash
$ npm install
$ flight-plan-converter [source] [dest]
```

or programatically:

```javascript
var converter = require('flight-plan-converter');

var msFpl = fs.readFileSync('some-microsoft-flight-sim-flight-plan.fpl', 'utf8');

fs.writeFileSync('x-plane-flight-plan.fms',
  // converts parsed/normalized flight plan to specifique format
  converter.convert(
    // parsed/normalized flight plan
    converter.parse(
      // raw input flight plan
      msFpl,
      // input format
      converter.formats.MS_FPL // -> 'ms_fpl'
    ),
    // output format
    converter.formats.XPLANE_FMS // -> 'xplane_fms'
  ),
  'utf8'
);

// or create a normalized flight plan

var fpl = {
  waypoints: [
    {
      lat: 50, lon: 11,
      elevation: 100, // elevation in ft
      type: converter.types.GPS // -> 'gps'
    },
    {
      lat: 52.24196492666667, lon: 11.85835872,
      elevation: 172,
      type: converter.types.AIRPORT // -> 'airport'
      airport: {
        icao: "EDBG"
      }
    },
    {
      lat: 52.074078, lon: 11.648333,
      elevation: 0,
      type: converter.types.NDB // -> 'ndb'
      ndb: {
        identifier: "MU"
      }
    },
    {
      lat: 52.546944, lon: 11.099722,
      elevation: 0,
      type: converter.types.FIX // -> 'fix'
      fix: {
        name: "BATEL"
      }
    }
  ]
};

fs.writeFileSync('my-xplane-fpl.fms',
  converter.convert(
    fpl,
    converter.formats.XPLANE_FMS
  ),
  'utf8'
);

```

'use strict';

const fs = require( 'fs' )

const lib = require( './lib' )
const { formatSuffixes, formatTypes } = lib

if( process.argv.length < 4 ) {
	console.error( `usage: ${process.argv[1]} [source] [dest]` )
	process.exit()
}

const ifn = process.argv[ 2 ]
const isuffix = ifn.slice( ( ifn.lastIndexOf( '.' ) - 1 >>> 0 ) + 2 )
const ikey = Object.keys( formatSuffixes ).find( key => formatSuffixes[ key ] === isuffix )
const itype = formatTypes[ ikey ]

const ofn = process.argv[ 3 ]
const osuffix = ofn.slice( ( ofn.lastIndexOf( '.' ) - 1 >>> 0 ) + 2 )
const okey = Object.keys( formatSuffixes ).find( key => formatSuffixes[ key ] === osuffix )
const otype = formatTypes[ okey ]

if( !itype || !otype ) {
	console.error( `unsupported type ${itype} ${otype}` )
	process.exit()
}

const ifs = fs.readFileSync( ifn, 'utf8' )

fs.writeFileSync( ofn,
    // converts parsed/normalized flight plan to specifique format
    lib.convert(
        // parsed/normalized flight plan
        lib.parse(
            // raw input flight plan
            ifs,
            // input format
            itype // -> 'ms_fpl'
        ),
        // output format
        otype,	// lib.formats.XPLANE_FMS // -> 'xplane_fms'
        { fmsVersion: '1100' }
    ) + '\n',
    'utf8'
);


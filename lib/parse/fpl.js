'use strict';

const libxml = require( "libxmljs" )

const {
    AIRPORT,
    NDB,
    VOR,
    FIX,
    GPS
} = require('../types');

function waypointFromNode( node ) {
    const identifierNode = node.get( 'identifier' )
    const typeNode = node.get( 'type' )
    const latNode = node.get( 'lat' )
    const lonNode = node.get( 'lon' )
    const altitudeNode = node.get( 'altitude' )
    const elevationNode = node.get( 'elevation' )
    const viaNode = node.get( 'via' )

    const identifier = identifierNode && identifierNode.text().trim()
    const type = typeNode && typeNode.text().trim().toLowerCase() // could say types[ type.toUpperCase() ]
    const lat = latNode && latNode.text().trim() || '0'
    const lon = lonNode && lonNode.text().trim() || '0'
    const altitude = altitudeNode && altitudeNode.text().trim() || '0'
    const elevation = elevationNode && elevationNode.text().trim() || '0'
    const via = viaNode && viaNode.text().trim()

    if( identifier ) {
        return {
            identifier,
            ...type && { type },
            ...lat && { lat },
            ...lon && { lon },
            ...altitude && { altitude },
            ...elevation && { elevation },
            ...via && { via },
        }
    }
}

function routepointFromRouteNode( rn ) {
    const identifierNode = rn.get( 'waypoint-identifier' )
    const typeNode = rn.get( 'waypoint-type' )
    const identifier = identifierNode ? rn.get( 'waypoint-identifier' ).text() : undefined
    const type = typeNode ? typeNode.text().trim().toLowerCase() : undefined // could say types[ type.toUpperCase() ]

    if( identifier ) {
        return {
            identifier,
            ...type && { type } 
        }
    }
}

function waypointFromrRoutePoint( rp, unroutedWaypointObject ) {
    const { identifier, type } = rp;
    const unroutedWaypoint = unroutedWaypointObject[ identifier ]
    let typeId
    switch( type ) {
        case AIRPORT: 
            typeId = { icao: identifier }
            break;
        case FIX: 
            typeId = { name: identifier }
            break;
        case VOR: 
        case NDB: 
        case GPS: 
        default: 
            typeId = { identifier }
            break;
    }

    return {
        ...unroutedWaypoint,
        ...rp,
        ...type && typeId && { [ type ]: typeId }
    }
}

/**
 * Converts XML FPL flight plans (like from Foreflight) to normalized flight plan
 * @param  {String} FPL XML flight plan
 * @return {Object} normalized flight plan
 */
module.exports = function ( input ) {
    const xml = input.replace( /xmlns=(.)[^\1]*\1/, '' )
    const xmlDoc = libxml.parseXmlString( xml )
    const waypointTable = xmlDoc.get( '//waypoint-table' )
    const route = xmlDoc.get( '//route' )
    const unroutedWaypointTable = xmlDoc.get( '//waypoint-table' )
    const routeNodes = route ? route.childNodes() : []
    const unroutedWaypointNodes = unroutedWaypointTable ? unroutedWaypointTable.childNodes() : []
    const unroutedWaypoints = unroutedWaypointNodes.map( waypointFromNode ).filter( Boolean )
    // presume no overlap between identifiers, even across types - otherwise should keep array and search based on id and type
    const unroutedWaypointObject = unroutedWaypoints.reduce( ( r, n ) => ({ ...r, [ n.identifier ]: n }), {} )
    const routepoints = routeNodes.map( routepointFromRouteNode ).filter( Boolean )
    const waypoints = routepoints.map( rp => waypointFromrRoutePoint( rp, unroutedWaypointObject ) )

    return {
        waypoints
    }
};

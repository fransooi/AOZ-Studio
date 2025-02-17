const WebSocket = require( "ws" );

// CORE
const archiver = require( './archiver.js' );
const banks = require( './banks.js' );
const dialogs = require( './dialogs.js' );
const project = require( './project.js' );
const net = require( './net.js' );
const filesystem = require( './filesystem.js' );
const shell = require( './shell.js' );
const Debugger = require( './debugger.js' );
const os = require( './os.js' ); 
const companion = require( './companion.js' ); 

// ARDUINO
const arduino = require( './arduino/arduino.js' );

//
// WebSocket SERVER
//
var sdkConnection = undefined;
var sdkWSServer = new WebSocket.Server( { port: 1974 } );

sdkWSServer.on( 'connection', function( ws )
{
    sdkConnection = ws;
    sdkConnection.on( 'message', function( message )
	{
        console.log( 'Received Message: ' + message );
		var json = JSON.parse( message );
		console.log( json );
		atom.editorSDK.parse( json );
    } );

    sdkConnection.on( 'close', function( reasonCode, description )
	{
        console.log( ( new Date() ) + ' Peer ' + sdkConnection.remoteAddress + ' disconnected.' );
    } );

} );

var EditorSDK = 
{
	archiver: archiver,
	banks: banks,
	dialogs: dialogs,
	project: project,
	net: net,
	filesystem: filesystem,
	shell: shell,
	debugger: Debugger,
	os: os,
	arduino: arduino,
	companion: companion,

	parse: function( message )
	{
		atom.editorSDK[ message.module ][ message.method ].call( this, message.options, function( response )
		{
			if( sdkConnection )
			{
				response.callbackId = message.callbackId;
				sdkConnection.send( JSON.stringify( response ) );
			}
			return;
		}, true );
	}
}
module.exports = EditorSDK;

String.prototype.strReplace = function( strSearch, strReplace )
{
	var newStr = '';
	for( n = 0; n < this.length; n++ )
	{
		var part = this.substr( n, strSearch.length );
		if( part == strSearch )
		{
			newStr = newStr + strReplace;
			n = n + ( strSearch.length - 1 );
		}
		else
		{
			newStr = newStr + part.substr( 0, 1 );
		}
	}

	return newStr;
}
const PATH = require( 'path' );
const FS = require( 'fs' );
const UTILITIES = require( '../transpiler/utilities' );

var companion = null;
var companionIsRunning = false;

function launchCompanionServer( options, cb, bySocket )
{
	if ( !companionIsRunning )
	{
		companionIsRunning = true;
	}
	if ( cb )
	{
		cb( { 
			error: false,
			event: 'launchcompanionserver',
		} );
	}
}
exports.launchCompanionServer = launchCompanionServer;

		/*
		var path = atom.ATOMApi.getInstallationPath( 'companion' );
		var pythonPath = atom.ATOMApi.getInstallationPath( 'python' );
		var cmd = pythonPath + ' main.py'; 
		companion = spawn( cmd, args, { cwd: path, shell: true } );
		companion.stdout.on( 'data', ( data ) =>
		{
			var message = '';
			for ( var c = 0; c < data.length; c++ )
				message += String.fromCharCode( data[ c ] );

			debugger;
			console.log( message );

			if ( message.indexOf( 'Server listening...' ) >= 0 )
			{
				callback( true, '', extra );
			}
			else
			{
				callback( false, '', extra );
			}
		} );
		transpiler.stderr.on( 'data', (data) =>
		{
			debugger;
			var message = '';
			for ( var c = 0; c < data.length; c++ )
				message += String.fromCharCode( data[ c ] );
			console.error( message );
			callback( false, data, extra );
		} );
		*/

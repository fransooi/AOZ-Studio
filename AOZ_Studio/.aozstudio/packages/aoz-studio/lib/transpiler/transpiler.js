/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* This source should not be distributed.                                       *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Transpiler interface
 *
 * Utilities
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 04/12/2018
 */
var FS = require( 'fs' );
var MKDIRP = require( 'mkdirp' );
var HJSON = require( 'hjson' );
var LOADASH = require( 'lodash' );
var PATH = require("path");
const CHILD_PROCESS = require('child_process');
var BTOA = require( 'btoa' );
var CHOKIDAR = require( 'chokidar' );
const UTILITIES = require( './utilities' );
const INLY = require( 'inly' );
const TARGZ = require( 'targz' );
const { exec, spawn } = require("child_process");
var WebSocket = require( 'ws' );

var transpiler;
var callback, extra;
var transpilerSocket;
var connected = false;

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

function init( options, cb, extra )
{
	atom.ncomp = 1;
	callback = cb;
	extra = extra;
	if ( atom.transpileMode == 1 )	
	{
		// Launch transpiler as a server
		var aozTranspilerPath = atom.AOZIO.getDirectoryString( atom.aozConfig.installInformation.transpilerPath );
		var self = this;
		console.log( "Execute Aoz Server" );
		var args = getArgs( '--server', options );
		var transpilerApp = '';
		if( process.platform == 'win32' )
		{
			transpilerApp = 'transpiler.exe';
		}

		if( process.platform == 'darwin' )
		{
			transpilerApp = 'transpiler-mac';
		}

		if( process.platform == 'linux' )
		{
			transpilerApp = 'transpiler-linux';
		}

		transpiler = spawn( '"' + aozTranspilerPath + PATH.sep + transpilerApp + '"', args, { cwd: aozTranspilerPath, shell: true } );
		transpiler.stdout.on( 'data', ( data ) =>
		{
			var message = '';
			for ( var c = 0; c < data.length; c++ )
				message += String.fromCharCode( data[ c ] );

			if ( message.indexOf( 'Aoz Transpiler Server listening' ) )
			{
				transpilerSocket = new WebSocket( "ws://localhost:1976" );

				transpilerSocket.onopen = function( e )
				{
					console.info( "[open] Connection established" );
					connected = true;

					// Send INIT command
					var command = 
					{
						command: 'init', 
						parameter: { transpilerPath: transpilerPath, drivePath: atom.aozConfig.installInformation.drivePath, applicationsPath: atom.aozConfig.installInformation.applicationsPath },
						extra: extra 
					};
					self.sendMessage( command );
				};
		
				transpilerSocket.onmessage = function( event )
				{	
					console.log( `[message] Data received from server: ${ event.data }` );
					
					var messages;
					try
					{
						message = JSON.parse( event.data );
					}
					catch( e )
					{}
					if ( message )
					{
						/*
						switch ( message.responseTo )
						{
							case 'init':
								callback( message.response, message.data, message.extra );
								break;
							case 'warmInit':
								callback( message.response, message.data, message.extra );
								break;
							case 'transpile':
								callback( message.response, message.data, message.extra );
								break;
							case 'transpileCommand':
								callback( message.response, message.data, message.extra );
								break;
							case 'indent':
								callback( message.response, message.data, message.extra );
								break;
						}
						*/
						callback( message.response, message.data, message.extra );
						callback = null;
					}
					else
					{
						callback( false, {}, extra );
						callback = null;
					}
				};
		
				transpilerSocket.onclose = function( event )
				{
					if( event.wasClean )
					{
						console.info(`[close] Connection closed cleanly, code=${ event.code } reason=${ event.reason }`);
					}
					else
					{
						console.warn( '[close] Connection died' );
						connected = false;
					}
				};
		
				transpilerSocket.onerror = function( error )
				{
					console.error( `[error] ${ error.message }` );
					callback = null;
					connected = false;
				};		
			}
			else
			{
				callback( false, '', extra );
			}
		} );
		transpiler.stderr.on( 'data', (data) =>
		{
			var message = '';
			for ( var c = 0; c < data.length; c++ )
				message += String.fromCharCode( data[ c ] );
			console.error( message );
			callback( false, data, extra );
		} );
	}
	else if ( atom.transpileMode == 2 )
	{ 
		callback( true, { version: 'unknown' }, extra );
	}
}
module.exports.init = init;

function clean()
{
	/**
	if( atom.debug === false )
	{
		var modules = 
		[
			'aoz', 'banks', 'compiler', 'en', 'extensionTokens', 'filesystem', 'fr', 'importer', 'informations', 'messages', 'tokens', 'utilities'
		]
		
		for( var m = 0; m < modules.length; m++ )
		{
			if( FS.existsSync(  atom.aozConfig.installInformation.transpilerPath + PATH.sep + modules[ m ] + '.js' ) )
			{
				FS.unlinkSync(  atom.aozConfig.installInformation.transpilerPath + PATH.sep + modules[ m ] + '.js' );
			}				
		}
	}
	*/
}
module.exports.clean = clean;

function warmInit( options, cb, extra )
{
	if ( atom.transpileMode == 1 )
	{
		callback = cb;
		var command = 
		{ 
			command: 'warmInit', 
			parameter: options,
			extra: extra 
		};
		sendMessage( command );	
	}
	else
	{
		cb( true, {}, extra );
	}
};
module.exports.warmInit = warmInit;

function transpile( options, cb, extra )
{
	callback = cb;
	// Copie les images de AOZ Drive si besoin
	var result = copyResourcesFromAOZDrive();
	if( result )
	{
		if( result.error )
		{

			if( callback )
			{
				var messages = 
				{
					logErrors: 
					[
						{
							type: 'error',
							text: result.message
						}
					]
				}
				callback( "failure", messages );	
			}
			return;		
		}
	}

	if( atom.transpileMode == 1 )
	{
		var command = 
		{ 
			command: 'transpile', 
			parameter: options,
			extra: extra
		};
		sendMessage( command );
	}
	else if ( atom.transpileMode == 2 )
	{
		var aozProjectPath = typeof options.buildPath == 'undefined' ? atom.workspace.getActiveTextEditor().projectPath : options.buildPath;
		options.insert = [ 	'-saveLastBuild true ' ];
		var cmd = getCommandLine( '--transpile', aozProjectPath, options );
		var self = this;
		console.log( "Execute Transpiler" );
		console.log( cmd );
		var message = { logErrors: [], logWarnings: [], indentation: [] };
		exec( cmd, ( error, stdout, stderr ) => 
		{
			if ( !error )
			{
				console.log( stdout );
				if ( stderr )
				{
					var pos = stderr.indexOf( 'WARNING[[[' );
					while ( pos >= 0 )
					{
						var end = stderr.indexOf( ']]]', pos );
						var json = stderr.substring( pos + 10, end );
						message.logWarnings.push( JSON.parse( json ) );
						pos = stderr.indexOf( 'WARNING[[[', end );
					}
					var pos = stderr.indexOf( 'ERROR[[[' );
					while ( pos >= 0 )
					{
						var end = stderr.indexOf( ']]]', pos );
						var json = stderr.substring( pos + 8, end );
						message.logErrors.push( JSON.parse( json ) )
						pos = stderr.indexOf( 'ERROR[[[', end );
					}
				}
				if ( message.logErrors.length == 0 && options.tags.indent == true )
				{
					var pos = stdout.indexOf( 'INDENT{{{' );
					if ( pos >= 0 )
					{
						var end = stdout.indexOf( '}}}', pos );
						var json = stdout.substring( pos + 9, end );
						try
						{
							message.indentation = JSON.parse( json );
						}
						catch( e )
						{}
					}
				}
				callback( message.logErrors.length == 0 ? "success" : "failure", message );
			}
			else
			{
				callback( "failure", message );
			}
		});
	}
};
module.exports.transpile = transpile;

function getCommandLine( command, path, options )
{
	var exePath = atom.aozConfig.installInformation.aozPath + PATH.sep + 'transpiler' + PATH.sep;
	var cmd = "exePath";
	var transpilerApp = '';

	command = '--path="' + atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler" ' + command;

	if( atom.serialChecked && atom.aozConfig.aoz_settings.serial && atom.aozConfig.aoz_settings.serial.trim() != '' )
	{
		command = "--serial=" + atom.aozConfig.aoz_settings.serial + " " + command;
	}

	if( atom.tokenChecked && atom.aozConfig.aoz_settings.token && atom.aozConfig.aoz_settings.token.trim() != '' )
	{
		command = "--token=" + atom.aozConfig.aoz_settings.token + " " + command;
	}

	if( process.platform == 'win32' )
	{
		transpilerApp = 'transpiler.exe';
	}

	if( process.platform == 'darwin' )
	{
		transpilerApp = 'transpiler-mac';
	}

	if( process.platform == 'linux' )
	{
		transpilerApp = 'transpiler-linux';
	}

	if( process.platform == 'win32' )
	{
		cmd = '"' + exePath + transpilerApp + '" ' + command + ' ';
	}
	else
	{
		cmd = 'cd "' + exePath.substring( 0, exePath.length - 1 ) + '";"./' + transpilerApp + '" ' + command + ' ';
	}
	
	function addTag( tag )
	{
		if ( typeof tag != 'string' )
			cmd += ' ' + tag + ' ';
		else
			cmd += ' "' + tag + '" ';
	}
	for ( var t in options.tags )
	{
		if ( UTILITIES.isArray( options.tags[ t ] ) )
		{
			for ( var tt = 0; tt < options.tags[ t ].length; tt++ )
			{
				cmd += '-' + t;
				addTag( options.tags[ t ][ tt ] );
			}
		}
		else
		{
			cmd += '-' + t;
			addTag( options.tags[ t ] );
		}
	}
	cmd += '-fromIDE true ';
	if ( options.insert )
	{
		for ( var i = 0; i < options.insert.length; i++ )
			cmd += options.insert[ i ];
	}
	cmd += '"' + path + '"';

	return cmd;
};

function getArgs( command, options )
{
	var args = [];
	args.push( command );
	for ( var t in options.tags )
	{
		if ( UTILITIES.isArray( options.tags[ t ] ) )
		{
			for ( var tt = 0; tt < options.tags[ t ].length; tt++ )
			{
				args.push( '-' + t );
				args.push( '' + options.tags[ t ][ tt ] );
			}
		}
		else
		{
			args.push( '-' + t );
			args.push( '' + options.tags[ t ] );
		}
	}
	args.push( '-port' )
	args.push( '1976' );
	args.push( '-fromIDE' )
	args.push( 'true' );
	return args;
};

function transpileCommand( value, options, cb, extra )
{
	if ( atom.transpileMode == 1 )
	{
		callback = cb;
		var command = 
		{ 
			command: 'transpileCommand', 
			parameter: { value: value, options: options },
			extra: extra 
		};
		sendMessage( command );
	}
	else if ( atom.transpileMode == 2 )
	{
		value = '[atob]' + BTOA( value );
		options.insert = [ 	'-saveLastBuild true ' ];
		var cmd = getCommandLine( '--transpilecommand', value, options );
		console.log( "Transpiling command" );
		console.log( cmd );
		var message = { logErrors: [], logWarnings: [] };
		exec( cmd, ( error, stdout, stderr ) => 
		{
			if ( !error )
			{
				if ( stderr )
				{
					var pos = stderr.indexOf( 'WARNING[[[' );
					while ( pos >= 0 )
					{
						var end = stderr.indexOf( ']]]', pos );
						var json = stderr.substring( pos + 10, end );
						message.logWarnings.push( JSON.parse( json ) );
						pos = stderr.indexOf( 'WARNING[[[', end );
					}
					var pos = stderr.indexOf( 'ERROR[[[' );
					while ( pos >= 0 )
					{
						var end = stderr.indexOf( ']]]', pos );
						var json = stderr.substring( pos + 8, end );
						message.logErrors.push( JSON.parse( json ) )
						pos = stderr.indexOf( 'ERROR[[[', end );
					}
				}
				var code = '';
				if ( stdout )
				{
					var pos = stdout.indexOf( 'CODE[[[' );
					if ( pos >= 0 )
					{
						var end = stdout.indexOf( ']]]', pos );
						code = stdout.substring( pos + 7, end );
					}
				}
				if ( message.logErrors.length > 0 )
				{
					var pos = message.logErrors[ 0 ].formattedText.indexOf( 'error: ' );
					cb( false, message.logErrors[ 0 ].formattedText.substring( pos + 7 ), extra );
				}
				else
				{
					cb( true, code, extra );
				}
			}
			else
			{
				cb( false, message );
			}
		});
	}
};
module.exports.transpileCommand = transpileCommand;

function convert( options, cb, extra )
{
	console.log( "Importing AMOS application..." );

	if ( atom.transpileMode == 1 )
	{
		callback = cb;
		var command = 
		{ 
			command: 'convert', 
			parameter: options,
			extra: extra
		};
		sendMessage( command );
	}
	else if ( atom.transpileMode == 2 )
	{
		debugger;
		options.insert = [ '-saveTo "' + options.destinationPath + '" ' ];
		var cmd = getCommandLine( '--convert', options.sourcePath, options );
		var message = { logErrors: [], logWarnings: [] };
		console.log( cmd );
		exec( cmd, ( error, stdout, stderr ) => 
		{
			if ( !error )
			{
				if ( stderr )
				{
					var pos = stderr.indexOf( 'WARNING[[[' );
					while ( pos >= 0 )
					{
						var end = stderr.indexOf( ']]]', pos );
						var json = stderr.substring( pos + 10, end );
						message.logWarnings.push( JSON.parse( json ) );
						pos = stderr.indexOf( 'WARNING[[[', end );
					}
					var pos = stderr.indexOf( 'ERROR[[[' );
					while ( pos >= 0 )
					{
						var end = stderr.indexOf( ']]]', pos );
						var json = stderr.substring( pos + 8, end );
						message.logErrors.push( JSON.parse( json ) )
						pos = stderr.indexOf( 'ERROR[[[', end );
					}
				}
				var code = '';
				if ( stdout )
				{
					var pos = stdout.indexOf( 'CODE[[[' );
					if ( pos >= 0 )
					{
						var end = stdout.indexOf( ']]]', pos );
						code = stdout.substring( pos + 7, end );
					}
				}
				if ( message.logErrors.length > 0 )
				{
					var pos = message.logErrors[ 0 ].formattedText.indexOf( 'error: ' );
					cb( false, message.logErrors[ 0 ].formattedText.substring( pos + 7 ), extra );
				}
				else
				{
					// Move folder to destination
					cb( 'success', code, extra );
				}
			}
			else
			{
				cb( 'failure', message );
			}
		});
	}
};
module.exports.convert = convert;

function sendMessage( message )
{
	console.log( 'send message: ', message );
	transpilerBusy = true;
	var json = JSON.stringify( message );
	transpiler.send( json )
}

function getWarning( warning )
{
	warning.text = atom.aozLang.getTerm( 'warning:' + warning.warning );
	if( warning.warning )
	{
		warning.text = atom.aozLang.getTerm( 'warning:' + warning.warning );
	}
	
	if( warning.compilerWarning )
	{
		warning.text = atom.aozLang.getTerm( 'warning:' + warning.compilerWarning );
	}

	if( warning.file )
	{
		warning.text += " " + atom.aozLang.getTerm( 'error:in_source' ) + " " + warning.file;
	}

	if( warning.line )
	{
		warning.text += " " + atom.aozLang.getTerm( 'error:at_line' ) + " " + warning.line;
	}

	if( warning.parameter )
	{
		warning.text = warning.text.strReplace( '%1', warning.parameter );
		warning.text = warning.text.strReplace( '_f', "#" );		
	}	
	return warning;
}

function getError( error )
{
	if( error.error )
	{
		error.text = atom.aozLang.getTerm( 'error:' + error.error );
	}

	if( error.compilerError )
	{
		error.text = atom.aozLang.getTerm( 'error:' + error.compilerError );
	}

	if( error.file )
	{
		error.text += " " + atom.aozLang.getTerm( 'error:in_source' ) + " " + error.file;
	}

	if( error.line )
	{
		error.text += " " + atom.aozLang.getTerm( 'error:at_line' ) + " " + error.line;
	}

	if( error.parameter )
	{
		error.text = error.text.strReplace( '%1', error.parameter );
		error.text = error.text.strReplace( '_f', '#' );
	}
	return error;
}


/**
 * Récupère les images à copier depuis le AOZ Drive dans le code aoz
 * @returns 
 */
function copyResourcesFromAOZDrive()
{
	var editor = atom.workspace.getActiveTextEditor();
	var workPath = '';
	if( editor )
	{
		if( editor.projectPath )
		{
			workPath = editor.projectPath;
		}
	}
	else
	{
		return {
			error: true,
			message: 'AOZ Project not found'  
		}
	}

	//console.log( "copyResourcesFromAOZDrive => " + workPath );
	var code = getAOZCode( workPath );
	var lines = code.split( "\n" );
	if( lines )
	{
		for( var l = 0; l < lines.length; l++ )
		{
			var line = lines[ l ].trim();
			if( line.substring( 0, 7 ).toLowerCase() == 'include' )
			{
				var filepath = line.substring( 7, line.length ).trim();
				filepath = filepath.strReplace( '"', "" );
				code = code + "\r\n" + getAOZCode( PATH.dirname( workPath ) + '/' + filepath );
			}
		}
	}

	var lines = code.split( "\n" );
	var currentLine = 0;
	var currentSrc = '';
	var openComment = false;
	var assetsLoaded = [];
    var files = [];
	if( lines )
	{
		for( var l = 0; l < lines.length; l++ )
		{
			var line = lines[ l ].toLowerCase();
			line = line.strReplace( '\r', '' );
			//
			// Référence les Assets chargés par Load Asset
			//
			if( line.trim().indexOf( 'load asset' ) > -1 )
			{
				var parts = line.trim().split( ',' );
				if( parts && parts.length == 2 )
				{
					assetsLoaded.push( parts[ 1 ].trim().toLowerCase().strReplace( '"', '' ) );
				}
			}

			if( line.trim().substring( 0, 3 ) == '::@' )
			{
				currentSrc = line.substring( 3, line.length ).trim();
				currentLine = 1;
				line = '';
			}

			if( line.trim().substring( 0, 2 ) == '/*' )
			{
				openComment = true;
			}

			if( line.trim().substring( 0, 2 ) == '*/' )
			{
				openComment = false;
				line = '';
				currentLine++;
			}

			if( openComment)
			{
				line = '';
				currentLine++;
			}
			
			if( line.trim().substring( 0, 1 ) == "'" || line.trim().substring( 0, 3 ) == 'rem' || line.trim().substring( 0, 2 ) == '//' )
			{
				line = '';
				currentLine++;
			}

			// Clean
			line = line.strReplace( ' = ', '=' );
			line = line.strReplace( ' =', '=' );
			line = line.strReplace( '= ', '=' );
			line = line.strReplace( ',', ', ');
			line = line.strReplace( ',  ', ', ');

            var words = line.split( ' ' );
            if( words )
            {
				var openSequence = false;
                for( var w = 0; w < words.length; w++ )
                {
                    var parts = words[ w ].split( '=' );
                    if( parts )
                    { 
						//
						// IMAGES
						//
                        if( ( parts[ 0 ].trim() == 'image' || parts[ 0 ].trim() == 'image$' || parts[ 0 ].trim() == 'fontname$'  ) && parts[ 1 ] )
                        {
							if( parts[ 1 ].indexOf( '"' ) > -1 )
                        {
                            var parts2 = parts[ 1 ].trim().strReplace( '"', '' ).split( ',' );
                            if( parts2 )
                            {
								parts2 = parts2[ 0 ].strReplace( '.png', '' ).split( '\n' );
									if( parts2[ 0 ].indexOf( '/' ) > -1 )
									{
										parts2[ 0 ] = parts2[ 0 ].substring( 0, parts2[ 0 ].indexOf( '/' ) );
									}

									if( parts2[ 0 ].indexOf( ':' ) > -1 )
									{
										parts2[ 0 ] = parts2[ 0 ].substring( 0, parts2[ 0 ].indexOf( ':' ) );
									}
									parts2[ 0 ] = parts2[ 0 ].trim();

									files.push( 
									{
										type: 'image',
										path: parts2[ 0 ],
										source: currentSrc,
										line: currentLine
									} );
								}
                            }
                        }

						//
						// ANIMATION SEQUENCE
						//
						if( openSequence )
						{
							var parts2 = parts[ 0 ].trim().strReplace( '"', '' ).split( ',' );
							if( parts2 )
							{
								var fp = parts2[ 0 ].strReplace( '.png', '' ).split( '\n' );
								if( fp )
								{
									if( fp[ 0 ]== 'loopmove' || fp[ 0 ] == 'reversemove' || fp[ 0 ] == 'l' || fp[ 0 ] == 'r' || fp[ 0 ] == 'e' )
									{
										openSequence = false;
									} 
									else
									{
										if( fp[ 0 ].indexOf( ':' ) > -1 )
										{
											fp[ 0 ] = fp[ 0 ].substring( 0, fp[ 0 ].indexOf( ':' ) );
										}
										files.push( 
										{
											type: 'image',
											path: fp[ 0 ],
											source: currentSrc,
											line: currentLine
										} );
									}
								}
							}
						}

						if( parts[ 0 ].trim() == 'sequence$' )
                        {
							if( !openSequence && parts[ 1 ] )
							{
								if( parts[ 1 ].indexOf( '"' ) > -1 )
								{
								var parts2 = parts[ 1 ].trim().strReplace( '"', '' ).split( ',' );
								if( parts2 )
								{
									var fp = parts2[ 0 ].strReplace( '.png', '' ).split( '\n' );
									if( fp )
									{ 
											if( fp[ 0 ].indexOf( ':' ) > -1 )
											{
												fp[ 0 ] = fp[ 0 ].substring( 0, fp[ 0 ].indexOf( ':' ) );
											}
											files.push( 
											{
												type: 'image',
												path: fp[ 0 ],
												source: currentSrc,
												line: currentLine
											} );											
									}
								}
								openSequence = true;
							}
                        }						
                    }
                }
            }
		}

			if( line.trim() != '' )
			{
				currentLine++;
			}
		}
	}
	//console.log( files );
    // Copie les fichiers depuis le AOZ Drive si besoin
    var drivePath = atom.aozConfig.installInformation.commonPath + '/app/Drives/AOZ Drive/resources/images';
	var resourcesPath = PATH.dirname( workPath ) + '/resources/1.images';
	if( !FS.existsSync( PATH.dirname( workPath ) + '/resources' ) )
	{
		try
		{
			FS.mkdir( PATH.dirname( workPath ) + '/resources' );
		}
		catch( e )
		{
			return {
				error: true,
				message: 'Unable to create the folder: ' + PATH.dirname( workPath ) + '/resources'  
			}
		}
	}
	
	if( !FS.existsSync( PATH.dirname( workPath ) + '/resources/1.images' ) )
	{
		try
		{
			FS.mkdir( PATH.dirname( workPath ) + '/resources/1.images' );
		}
		catch( e )
		{
			return {
				error: true,
				message: 'Unable to create the folder: ' + PATH.dirname( workPath ) + '/resources/1.images'  
			}
		}
	}

	// Copie le fichier fnt_default.png (font bitmap par défaut pour les Actors Text)
	FS.copyFileSync( atom.aozConfig.installInformation.commonPath + '/app/aoz/runtime/resources/fnt_default.png', resourcesPath + '/fnt_default.png' );		

	if( files.length > 0 )
	{
		for( var f = 0; f < files.length; f++ )
		{
			var fi = undefined;
			if( !FS.existsSync( resourcesPath + '/' + files[ f ].path + '.png' ) )
			{
				findFile( drivePath + '/' + files[ f ].path + '.png', function( file )
			{
					fi = file;
					if( fi == undefined )
					{
						findFile( drivePath + '/' + files[ f ].path + '.jpg', function( file )
						{
							fi = file;
							if( fi == undefined )
							{
								findFile( drivePath + '/' + files[ f ].path + '.jpeg', function( file )
								{
									fi = file;
									if( fi == undefined )
									{
										findFile( drivePath + '/' + files[ f ].path + '.jpeg', function( file )
										{
											fi = file;
											if( fi == undefined )
											{
												findFile( drivePath + '/' + files[ f ].path + '.svg', function( file )
												{
													fi = file;
													if( fi == undefined )
													{
														findFile( drivePath + '/' + files[ f ].path + '.gif', function( file )
														{
															fi = file;
															if( fi == undefined )
															{
																findFile( drivePath + '/' + files[ f ].path + '.bmp', function( file )
																{
																	fi = file;
																} );
															}
														} );
													}
												} );
											}
										} );
									}
								} );
							}
						} );
					}
				} );

				// Si le fichier à copier n'a pas été trouvé et qu'il ne s'agit pas d'un asset chargé avec Load Asset
				// alors on envoi une erreur au Transpiler
				if( fi == undefined && assetsLoaded.indexOf( files[ f ].path.trim().toLowerCase() ) == -1 )
				{
					return {
						error: true,
						message: "Image " + files[ f ].path + ' not found in ' + files[ f ].source + ' at line ' + files[ f ].line,
						path: files[ f ].source,
						line: files[ f ].line,
						column: 1
					}
				}

					if( !FS.existsSync( resourcesPath ) )
					{
						try
						{
							FS.mkdirSync( resourcesPath );
						}
						catch( e )
						{
						return {
							error: true,
							message: 'Unable to create the folder: ' + resourcesPath  
						}
					}
				}

				// Copie la resources depuis le AOZ Drives vers le projet
				if( assetsLoaded.indexOf( files[ f ].path.trim().toLowerCase() ) == -1 )
				{
					FS.copyFileSync( fi, resourcesPath + '/' + PATH.basename( fi ).toLowerCase() );
				}
			}
		}
	}
}

function findFile( path, cb )
{
	var dirName = PATH.dirname( path );
	var fileName = PATH.basename( path );
	
	FS.readdirSync( dirName).forEach( function( file )
	{
		var subpath = dirName + '/' + file;
		if( FS.lstatSync( subpath ).isDirectory() )
		{
			findFile( subpath + '/' + fileName, cb );
		} else {
			if( file.toLowerCase() == fileName.toLowerCase() )
			{
				if( cb )
				{
					cb( dirName + '/' + file );
					return;
			}
		}
	}
	} );
}

function getAOZCode( path )
{
	if( FS.existsSync( path ) )
	{
		var data = FS.readFileSync( path );
		return '::@' + path + '\r\n' + data.toString();
	}
	return '';
}

function copyRecursiveSync( src, dest )
{
	var exists = FS.existsSync( src );
	var stats = exists && FS.statSync( src );
	var isDirectory = exists && stats.isDirectory();
	if( isDirectory )
	{
		if( !FS.existsSync( dest ) )
		{
			console.log( dest );
			FS.mkdirSync( dest );
		}
		FS.readdirSync( src ).forEach( function( childItemName )
		{
			copyRecursiveSync( PATH.join( src, childItemName ),	PATH.join( dest, childItemName ) );
		} );
	}
	else
	{
		FS.copyFileSync( src, dest );
	}
};

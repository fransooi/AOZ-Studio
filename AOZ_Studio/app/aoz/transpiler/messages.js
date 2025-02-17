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
 * AOZ Transpiler
 *
 * Messages and errors
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 04/12/2018
 */

var LOCALE = require( 'get-user-locale' );
var utilities = require( './utilities' );
var FS = require( 'fs' );
var PATH = require( 'path' );

var messages = {};
var errors = {};
var warnings = {};
var compilerWarnings = {};
var compilerErrors = {};
var messages_backup = {}, errors_backup = {}, warnings_backup = {}, compilerWarnings_backup= {}, compilerErrors_backup = {};
var language = 'en';
var logPath = '';
var logText = '';
var logOn = false;
var logWarnings = undefined;
var logErrors = undefined;
var outputToConsole = true;
var outputToJSON = false;
var outputObject =
{
	response: '',
	data: {},
	extra: {}
};

// Levels of verbosity
var VERBOSE_QUIET = 0;					// Output nothing at all.
var VERBOSE_MESSAGES = 1;				// Output titles and copyright
var VERBOSE_ERRORS = 2;					// Output errors
var VERBOSE_WARNINGS = 3;				// Output warnings
var VERBOSE_DEV1 = 4;					// Developer-> output compilation stages 
var VERBOSE_DEV2 = 5;					// Developer-> output file loaded and saved
var VERBOSE_DEV3 = 6;					// Developer-> outputs everything
var VERBOSE_DEFAULT = VERBOSE_MESSAGES;	// Default-> only main info + errors.
module.exports.VERBOSE_QUIET = VERBOSE_QUIET;
module.exports.VERBOSE_MESSAGES = VERBOSE_MESSAGES;
module.exports.VERBOSE_ERRORS = VERBOSE_ERRORS;
module.exports.VERBOSE_WARNINGS = VERBOSE_WARNINGS;
module.exports.VERBOSE_DEV1 = VERBOSE_DEV1;			
module.exports.VERBOSE_DEV2 = VERBOSE_DEV2;
module.exports.VERBOSE_DEV3 = VERBOSE_DEV3;
module.exports.VERBOSE_DEFAULT = VERBOSE_MESSAGES;

// List of errors
var errorList = [];
var numberOfErrors = 0;
var numberOfWarnings = 0;
var verbosity = VERBOSE_DEFAULT;
var options;
var startTime = 0;
var transpilerPath = undefined;

// Cold start: add the current language
function addLanguage( lan, mes, err, warn, compWarnings, compErrors )
{
	lan = lan.toLowerCase();
	messages_backup[ lan ] = mes;
	errors_backup[ lan ] = err;
	warnings_backup[ lan ] = warn;
	compilerWarnings_backup[ lan ] = compWarnings;
	compilerErrors_backup[ lan ] = compErrors;
};
module.exports.addLanguage = addLanguage;

function init( transPath )
{
	language = 'en';
	errorList = [];
	numberOfErrors = 0;
	numberOfWarnings = 0;
	verbosity = VERBOSE_DEFAULT;
	messages = utilities.copyObject( messages_backup );
	errors = utilities.copyObject( errors_backup );
	warnings = utilities.copyObject( warnings_backup );
	compilerWarnings = utilities.copyObject( compilerWarnings_backup );
	compilerErrors = utilities.copyObject( compilerErrors_backup );
	logOn = false;
	logText = '';
	transpilerPath = transPath;
}
module.exports.init = init;

function set_autoTranslate( lang )
{
	/*
	if ( lang == '' )
		return;
	//debugger;

	lang = lang.toLowerCase();
	if ( !errors_backup[ lang ] )
	{
		print_always( 'starting_autotranslate', lang );

		var groupsDestination = [];
		var groupsDone = [];
		var groupsCount = 0;
		translateIt( messages_backup, messages );
		//translateIt( errors_backup, errors );
		//translateIt( warnings_backup, warnings );
		//translateIt( compilerWarnings_backup, compilerWarnings );
		//translateIt( compilerErrors_backup, compilerErrors );

		function translateIt( group, groupDestination )
		{
			translateGroup( group, groupDestination, 'en', lang, function( response, data, extra )
			{
				if ( response )
				{
					groupsCount++;
					if ( groupsCount == 1 )
					{
						//debugger;
						addLanguage( lang, messages[ lang ], errors[ lang ], warnings[ lang ], compilerWarnings[ lang ], compilerErrors[ lang ] );
						print_always( 'autotranslate_complete' );
					}
				}
			} );
		};
	}
	function translateGroup( group, groupDestination, source, destination, callback, extra1 )
	{
		var toDo = [];
		var toDoIds = [];
		if ( !groupDestination[ destination ] )
			groupDestination[ destination ] = [];

		// Evaluates job
		for ( var count = 0; count < group[ source ].length; count++ )
		{
			var line = group[ source ][ count ];
			if ( line != '' )
			{
				var pos = line.indexOf( ':' );
				if ( pos > 0 )
				{
					var id = line.substring( 0, pos + 1 );
					var text = line.substring( pos + 1 ).trim();

					// Check if already done...
					var found = false;
					var list = groupDestination[ destination ];
					for ( var l = 0; l < list.length; l++ )
					{
						if ( list[ l ].indexOf( id ) == 0 )
						{
							found = true;
							break;
						}
					}
					if ( !found )
					{
						toDo.push( text );
						toDoIds.push( id );
					}
				}
			}
		}

		// Do the translation!
		if ( toDo.length > 0 )
		{
			var count = 0;
			utilities.translate( toDo, source, destination, function( response, result, extra )
			{
				if ( response )
				{
					var newGroup = [];
					for ( var l = 0; l < toDo.length; l++ )
					{
						newGroup.push( toDoIds[ l ] + result[ l ] );
					}
					extra[ destination ] = newGroup;
					callback( true, extra[ destination ], extra1 );
				}
			}, groupDestination );
		}
	}
	*/
}
module.exports.set_autoTranslate = set_autoTranslate;

function close()
{
	if ( logOn )
	{
		try
		{
			FS.writeFileSync( logPath, logText, { encoding: 'utf8' } );
		}
		catch( e )
		{
			console.log( "Warning: cannot save transpiler log.", logPath );
		}	
	}
}
module.exports.close = close;

// Set the level of verbosity
function setOptions( o )
{
	options = o;
	verbosity = VERBOSE_DEFAULT;
	if ( o.verbose && o.verbose != verbosity )
		verbosity = o.verbose;
	else if ( o.developperMode )
		verbosity = VERBOSE_DEV1;
		
	if ( options.manifestTranspiler )
	{
		if ( options.manifestTranspiler.language )
			language = options.manifestTranspiler.language;
		else
			language = LOCALE.getUserLocale().substring( 0, 2 );
	}

	logOn = o.logOn ? true : false;
	logPath = o.logPath;
	if ( !logPath || ( logPath && logPath == '' ) ) 
		logOn = false;
	if ( logOn && logText.length == 0 )
	{
		logText += 'Aoz Transpiler log - ' + new Date() + '\n';
		logText += '--------------------------------------------------------------------------\n';
	}

	startTime = new Date().getTime();
}
module.exports.setOptions = setOptions;

function setLogWarningsAndErrors( ONOFF )
{
	if ( ONOFF )
	{
		logWarnings = [];
		logErrors = [];
	}
	else
	{
		logWarnings = undefined;
		logErrors = undefined;
	}
};
module.exports.setLogWarningsAndErrors = setLogWarningsAndErrors;

function sourceToLog( lines )
{
	var path = '';
	for ( var l = 0; l < lines.length; l++ )
	{
		var line = lines[ l ];		
		if ( line.include.path != path )
		{
			path = line.include.path;
			logText += '\n--> Source: ' + path + '\n';
		}
		logText += line.include.source.substring( line.localStart, line.localEnd ) + '\n';
	}
}
module.exports.sourceToLog = sourceToLog;

// Assersions
function assert( condition, text )
{
	if ( !condition )
	{
		var messageObject =
		{
			type: 'assert',
			text: text,
			level: VERBOSE_ERROR
		};
		do_output( messageObject );
	}
};
module.exports.assert = assert;

// Error handling
function pushError( err, fatal )
{
	var found = false;
	if ( !err.compilerWarning && !err.compilerError && !err.compilerAssert )
	{
		for ( var e = 0; e < errorList.length; e++ )
		{
			var ee = errorList[ e ];
			if ( ee.error == err.error && ee.line == err.line )			// On SAME error per line.
				found = true;
		}
	}

	// Look for removed warnings...
	var warning;
	if ( err.compilerWarning )
	{
		warning = err.compilerWarning;
	}
	else
	{
		if ( err.warning )
		{
			warning = err.warning;		
		}
	}
	if ( warning && options.manifest && options.manifest.compilation.noWarning && options.manifest.compilation.noWarning.find( function( element ) { return element.toLowerCase() == warning.toLowerCase() } ) )
		found = true;

	// Special case for 'variable_not_declared'
	if ( !found && warning == 'variable_not_declared' )
	{
		var index = errorList.find( function( element )
		{
			if ( element.warning == 'variable_not_declared' )
				return element.parameter == err.parameter;
			return false;
		} );
		if ( index )
			found = true;
	}

	if ( !found )
	{
		errorList.push( err );
		if ( err.error || err.compilerError )
		{
			err.type = 'error';
			err.path = err.file;
			err.level = VERBOSE_ERRORS;
			err.text = err.error + ':' + err.line + ':' + err.column;
			numberOfErrors++;
		}

		if ( err.warning || err.compilerWarning )
		{
			err.type = 'warning';
			err.path = err.file;
			err.level = VERBOSE_WARNINGS;
			err.text = err.warning + ':' + err.line + ':' + err.column;
			numberOfWarnings++;
		}
	}

	if ( true )
	{
		if ( err.compilerError )
			compilerError( err.compilerError, err.file, err.parameters ? err.parameters : ( err.parameter ? err.parameter : undefined ) );
	}
	if ( fatal )
		throw err;

}
module.exports.pushError = pushError;

// Simple output
function print( level, id, params )
{
	if ( level <= verbosity )
	{
		var text = getText( id, messages, params );
		var messageObject =
		{
			type: 'info',
			text: text,
			level: level
		};
		do_output( messageObject );
	}
};
module.exports.print = print;



// Is there errors in the pile?
function isErrors()
{
	return numberOfErrors > 0;
}
module.exports.isErrors = isErrors;

// Is there warnings in the pile?
function isWarnings()
{
	return numberOfWarnings > 0;
}
module.exports.isWarnings = isWarnings;

// Clear the warnings
function clearErrors()
{
	errorList = [];
	numberOfErrors = 0;
	numberOfWarnings = 0;
}
module.exports.clearErrors = clearErrors;
function clearWarnings()
{
	var temp = [];
	for ( var e = 0; e < errorList.length; e++ )
	{
		var err = errorList[ e ];
		if ( err.error || err.compilerError )
		{
			temp.push( err );
		}
	}
	errorList = temp;
}
module.exports.clearWarnings = clearWarnings;

// Returns the list of errors
function getErrors()
{
	var errors = [];
	for ( var e = 0; e < errorList.length; e++ )
	{
		var err = errorList[ e ];
		if ( err.error )
		{
			errors.push( error( err.error, err.file, err.line, err.column, err.parameter, { silent: true } ) );
		}
		else if ( err.compilerError )
		{
			errors.push( compilerError( err.compilerError, err.file, err.parameters ? err.parameters : ( err.parameter ? err.parameter : undefined ), { silent: true } ) );
		}
	}
	return errors;
}
module.exports.getErrors = getErrors;

// Prints out the errors
function printErrors()
{
	for ( var e = 0; e < errorList.length; e++ )
	{
		var err = errorList[ e ];
		if ( err.error )
		{
			error( err.error, err.file, err.line, err.column, err.parameter );
		}
		else if ( err.compilerError )
		{
			compilerError( err.compilerError, err.file, err.parameters ? err.parameters : ( err.parameter ? err.parameter : undefined ) );
		}
	}
}
module.exports.printErrors = printErrors;

// Print out the warnings
function printWarnings()
{
	for ( var e = 0; e < errorList.length; e++ )
	{
		var err =	errorList[ e ];
		if ( err.warning )
		{
			warning( err.warning, err.file, err.line, err.column, err.parameter );
		}
		else if ( err.compilerWarning )
		{
			compilerWarning( err.compilerWarning, err.file, err.parameters ? err.parameters : ( err.parameter ? err.parameter : undefined ) );
		}
	}
}
module.exports.printWarnings = printWarnings;

// Print compiler error
function compilerError( id, file, params, opts )
{
	opts = typeof opts == 'undefined' ? {} : opts;

	file = file ? utilities.cleanPath( file ) : file;
	var errorText = getText( 'compilation_error', messages );
	var error = getText( id, compilerErrors, params, opts );

	var message;
	error = error.substring( 0, 1 ).toLowerCase() + error.substring( 1 );
	if ( typeof file == 'undefined' )
		message = errorText + ': ' + error;
	else
		message = file + ':1:1: ' + errorText + ': ' + error;

	var messageObject =
	{
		type: 'compiler_error',
		text: message,
		message: error,
		level: VERBOSE_ERRORS,
		file: file
	};
	if ( !opts.silent )
	do_output( messageObject );
	return messageObject;
};
module.exports.compilerError = compilerError;

// Print compiler warning
function compilerWarning( id, file, params )
{
	file = file ? utilities.cleanPath( file ) : file;
	var warningText = getText( 'compilation_warning', messages );
	var warning = getText( id, compilerWarnings, params );
	warning = warning.substring( 0, 1 ).toLowerCase() + warning.substring( 1 );

	var message = '';
	if ( typeof file != 'undefined' ? file : '' )
		message += file + ':1:1: '
	message += warningText + ': ' + warning;

	var messageObject =
	{
		type: 'compiler_warning',
		text: message,
		message: warning,
		level: VERBOSE_WARNINGS,
		file: file
	};
	do_output( messageObject );
};
module.exports.compilerWarning = compilerWarning;

// Formatted warnings
// helloWorld.c:5:3: warning: implicit declaration of function ‘prinft’
function warning( id, file, line, column, params )
{
	file = file ? utilities.cleanPath( file ) : file;
	var warningText = getText( 'warning', messages );
	var warning = getText( id, warnings, params );
	var message = file + ':' + line + ':' + column + ': ' + warningText + ': ' + warning;	//.toLowerCase();\

	warning = warning.charAt( 0 ).toLowerCase() + warning.substring( 1 );
	var text = getText( 'readable_warning', messages, [ warning, line, column, utilities.getFilenameAndExtension( file ) ] );
	var messageObject =
	{
		type: 'warning',
		level: VERBOSE_WARNINGS,
		text: text,
		message: message,
		formattedText: message,
		path: file,
		line: line,
		column: column
	};
	do_output( messageObject );
};
module.exports.warning = warning;

// Formatted errors
function error( id, file, line, column, params, opts )
{
	opts = typeof opts == 'undefined' ? {} : opts;
	params = typeof params != 'array' ? [ params ] : params;
	file = file ? utilities.cleanPath( file ) : 'main.aoz';
	var errorText = getText( 'error', messages );
	var error = getText( id, errors, params );
	var message = file + ':' + line + ':' + column + ': ' + errorText + ': ' + error;		//.toLowerCase();

	error = error.charAt( 0 ).toLowerCase() + error.substring( 1 );
	var text = getText( 'readable_error', messages, [ error, line, column, utilities.getFilenameAndExtension( file ) ] );
	var messageObject =
	{
		type: 'error',
		level: VERBOSE_ERRORS,
		text: text,
		formattedText: message,
		path: file,
		line: line,
		column: column
	};
	if ( !opts.silent )
		do_output( messageObject );
	return messageObject;
};
module.exports.error = error;

// Returns the text from ID
function getMessage( id, params )
{
	return getText( id, messages, params );
};
module.exports.getMessage = getMessage;

// Returns the whole list of runtime errors
function getErrorList()
{
	var errors = utilities.copyObject( errors_backup );
	return errors;
};
module.exports.getErrorList = getErrorList;

// Outputs the text
function getTime()
{
    var deltaTime = new Date().getTime() - startTime;
	var milli = deltaTime % 1000;
    var min =  Math.floor( deltaTime / 60000 );
	var sec = Math.floor( ( deltaTime - min * 60000 ) / 1000 );
	var minString = '' + min;
	var secString = '' + sec;
	var milliString = '' + milli;
	while ( milliString.length < 3 )
		milliString += '0';
	while ( minString.length < 2 )
		minString = '0' + minString;
	while ( secString.length < 2 )
		secString = '0' + secString;
    return minString + ':' + secString + ':' + milliString;
};

function do_output( messageObject )
{
	var lines = messageObject.text.split( '\n' );
	var level = messageObject.level;
	if ( lines.length > 1 && lines[ lines.length - 1 ] == '' )
		lines.length--;
	for ( var l = 0; l < lines.length; l++ )
	{
		if ( level >= VERBOSE_DEV1 )
		{
			if ( l == 0 )
				lines[ l ] = getTime() + ' - ' + lines[ l ];
			else 
				lines[ l ] = '          - ' + lines[ l ];
		}
	}

	if ( logOn )
	{
		for ( var l = 0; l < lines.length; l++ )
		{
			logText += lines[ l ] + '\n';
		}
	}		
	if ( outputToJSON )
	{
		outputObject.response = 'text';
		outputObject.data = [];
		for ( var l = 0; l < lines.length; l++ )
			outputObject.data.push( lines[ l ] + ( l < lines.length - 1 ? '\n' : '' ) )
	}	
	if ( outputToConsole )
	{
		switch ( level )
		{
			case VERBOSE_MESSAGES:
				for ( var l = 0; l < lines.length; l++ )
					console.info( lines[ l ] );
				break;
			case VERBOSE_WARNINGS:
				for ( var l = 0; l < lines.length; l++ )
					console.warn( lines[ l ] );
				break;
			case VERBOSE_ERRORS:
				for ( var l = 0; l < lines.length; l++ )
					console.error( lines[ l ] );
				break;
			case VERBOSE_DEV1:
			case VERBOSE_DEV2:
			case VERBOSE_DEV3:
				for ( var l = 0; l < lines.length; l++ )
					console.log( lines[ l ] );
				break;
			case VERBOSE_QUIET:
				default:
				break;
		}
	};
	if ( options.fromIDE )
	{
		if ( messageObject.type == 'warning' )
			console.error( 'WARNING[[[' + JSON.stringify( messageObject ) + ']]]' );
		else if ( messageObject.type == 'error' )
			console.error( 'ERROR[[[' + JSON.stringify( messageObject ) + ']]]' );
	}		
	if ( options.callback && messageObject )
	{
		messageObject.output = ( messageObject.type == VERBOSE_ERRORS ? 'stderr' : 'stdout' );
		options.callback( 'running', messageObject, options.callbackExtra );
	}
};

// Computes a text
function getText( id, list, params )
{
	if ( list[ language ] )
		return getTheText( id, list[ language ], params );
	return getTheText( id, list[ 'en' ], params );
};
module.exports.getText = getText;

function getTheText( id, list, params )
{
	params = typeof params == 'undefined' ? [] : params;
	params = !utilities.isArray( params ) ? [ params ] : params;

	id += ':';
	var message = 'Message not found ' + id + '(%1, %2, %3, %4)<BR>';
	for ( var l = 0; l < list.length; l++ )
	{
		if ( list[ l ].indexOf( id ) == 0 )
		{
			message = utilities.trimString( list[ l ].substring( id.length ) );
			break;
		}
	}
	for ( var p = 0; p < params.length; p++ )
	{
		message = utilities.replaceStringInText( message, '%' + ( p + 1 ), '' + params[ p ] );
		message = utilities.replaceStringInText( message, '%P' + ( p + 1 ), '' + params[ p ] );
	}
	for ( var p = 0; p < 5; p++ )
	{
		message = utilities.replaceStringInText( message, '%' + ( p + 1 ), '' );
		message = utilities.replaceStringInText( message, '%P' + ( p + 1 ), '' );
	}
	message = utilities.replaceStringInText( message, '<BR>', '\n' );
	return message;
}	


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
 * Utilities
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 04/12/2018
 */
var FS = require( 'fs' );
var MKDIRP = require( 'mkdirp' );
var HJSON = require( 'hjson' );
var MESSAGES = require( './messages' );
var PNG = require('pngjs').PNG;
var LOADASH = require( 'lodash' );
var PATH = require("path");
var MD5 = require("md5");

var numberOfFilesOpen = 0;
module.exports.numberOfFilesOpen = numberOfFilesOpen;

var translationApiKey = "";
var translationApiURL = "https://www.googleapis.com/language/translate/v2/";

// Translation
function translate( text, source = 'en', target = 'fr', callback, extra1 )
{
	if ( typeof text == 'undefined' )
		return 'illegal_function_call';
	if ( text === '' )
		return;
	if ( !callback )
		throw 'illegal_function_call';

	var texts = text;
	var isString = false;
	if ( typeof texts == 'string' )
	{
		texts = [ text ];
		isString = true;
	}

	// Clean text
	for ( var l = 0; l < texts.length; l++ )
	{
		var line = texts[ l ];
		var ok = false;
		for ( var p = 0; p < line.length; p++ )
		{
			if ( getCharacterType( line.charAt( p ) ) == 'letter' )
			{
				ok = true;
				break;
			}
		}
		if ( !ok )
		{
			texts[ l ] = '  ';
		}
	}

	var pos;
	var urls = [];
	var textNumber = 0;
	do
	{
		var url = translationApiURL;
		url += "?key=" + translationApiKey;
		url += "&target=" + target;
		url += "&source=" + source;
		url += "&format=text";
		for ( var t = textNumber; t < texts.length; t++ )
		{
			var uri = encodeURI( texts[ t ] );
			while ( ( pos = uri.indexOf( '#' ) ) >= 0 )
				uri = uri.substring( 0, pos ) + '%23' + uri.substring( pos + 1 );
			if ( url.length + uri.length >= 2000 && t != textNumber )
				break;
			url += "&q=" + uri;
		}
		textNumber = t;
		urls.push( url );
	} while( textNumber < texts.length )

	var count = 10;
	var numberOfRequests = urls.length;
	var responses = [];
	for ( var u = 0; u < urls.length; u++ )
	{
		sendRequest( urls[ u ], doneRequest, u );
	}
	function doneRequest( response, result, extra )
	{
		var responses = [];
		var responseNumber = extra;
		if ( response )
		{
			if ( isString )
			{
				callback( url, result.data.translations[ 1 ].translatedText, extra1 );
			}
			else
			{
				responses[ responseNumber ] = result.data.translations;

                numberOfRequests--;
                if ( numberOfRequests == 0 )
                {
					var finalResult = [];
					for ( var r = 0; r < responses.length; r++ )
					{
						var response = responses[ r ];
						if ( response )
						{
							for ( var t = 0; t < response.length; t++ )
							{
								finalResult.push( response[ t ].translatedText );
							}
						}
					}
					callback( true, finalResult, extra );
				}
			}
		}
		else
		{
			console.log( 'Resending translation request', count );
			if ( --count > 0 )
				sendRequest( data, doneRequest, responseNumber );
			else
				callback( false, 'translation_failed', extra1 );
		}
	}
}
module.exports.translate = translate;

function sendRequest( url, callback, extra )
{
	var request = new XMLHttpRequest();
	request.onload = function()
	{
		if ( this.status >= 200 && this.status < 400 )
		{
			var json = JSON.parse( this.responseText );
			callback( true, json, extra );
		}
	}
	request.onerror = function()
	{
		callback( false, 'communication_error', extra );
	}
	request.open( 'GET', url, true );
	request.send()
}
module.exports.sendRequest = sendRequest;

//
// File utilities
//
function filterFilename( name, wildcards )
{
	name = name.toLowerCase();
	if ( typeof wildcards == 'string' )
		wildcards = [ wildcards ];

	for ( w = 0; w < wildcards.length; w++ )
	{
		var wildcard = wildcards[ w ].toLowerCase();

		// Look for *[ and ]*
		if ( ( start = wildcard.indexOf( '*[' ) ) >= 0 )
		{
			var end = wildcard.indexOf( ']*', start );
			if ( end >= start )
			{
				start += 2;
				var filter = wildcard.substring( start, end );
				if ( name.indexOf( filter ) >= 0 )
					return true;
				if ( start - 2 == 0 && end + 2 == wildcard.length )
					continue;
				var newFilter = '';
				for ( var f = 0; f < end - start; f++ )
					newFilter += '?';
				wildcard = wildcard.substring( 0, start - 2 ) + newFilter + wildcard.substring( end + 2 );
			}
		}

		var pName = 0;
		var pWild = 0;
		var afterDot = false;
		var bad = false;
		do
		{
			var cName = name.charAt( pName );
			var cWild = wildcard.charAt( pWild );
			switch ( cWild )
			{
				case '*':
					if ( afterDot )
						return true;
					pName = name.lastIndexOf( '.' );
					pWild = wildcard.indexOf( '.' );
					if ( pName < 0 && pWild < 0 )
						return true;
					afterDot = true;
					break;
				case '.':
					afterDot = true;
					if ( cName != '.' )
						bad = true;
					break;
				case '?':
					break;
				default:
					if ( cName != cWild )
						bad = true;
					break;
			}
			pName++;
			pWild++;
		} while( !bad && pName < name.length )
		if( !bad && pWild < wildcard.length )
			bad = true;
		if ( !bad )
			return true;
	}
	return false;
};
module.exports.filterFilename = filterFilename;

var numberOfDirectories = 0;
var numberOfFiles = 0;
function getFileInfo( path, options )
{
	var result = undefined;
	var stats = statsIfExists( path )
	if ( stats )
	{
		if ( stats.isDirectory() )
		{
			result = 
			{
				name: getFilenameAndExtension( path ),
				path: path,
				isDirectory: true,
				size: 0,
				stats: stats
			};
		}
		else
		{
			result = 
			{
				name: getFilenameAndExtension( path ),
				path: path,
				isDirectory: false,
				size: stats.size,
				stats: stats
			};
		}
	}
	return result;	
};
module.exports.getFileInfo = getFileInfo;


function getDirectory( path, options )
{
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'getting_directory', [ path ] );

	numberOfDirectories = 0;
	numberOfFiles = 0;
	return getDir( path, options );
};
function getDir( path, options, parent )
{
	var result = [];
	path = cleanPath( path );

	var files;
	try
	{
		files = FS.readdirSync( path + '/' );
	}
	catch( err )
	{
		return null;
	}
	if ( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var sPath = path + '/' + files[ f ];
			var stats = undefined;
			try
			{
				stats = FS.statSync( sPath );
			}
			catch ( err )
			{}
			if ( stats )
			{
				if ( !stats.isDirectory() )
				{
					if ( !options.excludes || ( options.excludes && !filterFilename( sPath, options.excludes ) ) )
					{
						if ( !options.filters || ( options.filters && filterFilename( sPath, options.filters ) ) )
						{
							numberOfFiles++;
							result.push(
							{
								name: files[ f ],
								path: sPath,
								isDirectory: false,
								size: stats.size,
								stats: stats,
								parent: parent
							} );
						}
					}
				}
				else
				{
					numberOfDirectories++;
					if ( options.recursive )
					{
						var newFile = undefined;
						if ( !options.onlyFiles )
						{
							newFile = 
							{
								name: files[ f ],
								path: sPath,
								isDirectory: true,
								files: null,
								parent: parent
							};
						}
						var newResult = getDir( sPath, options, newFile );
						if ( !options.onlyFiles )
						{
							newFile.files = newResult;
							result.push( newFile );
						}
					}
					else
					{
						if ( !options.onlyFiles || options.onlyDirectories || options.directories )
						{
							result.push(
							{
								name: files[ f ],
								path: sPath,
								isDirectory: true,
								files: [],
								parent: parent
							} );
						}
					}
				}
			}
		}
	}
	return result;
};
module.exports.getDirectory = getDirectory;

function getFilesFromTree( tree, result )
{
	if ( !result )
		result = {};
	for ( var d = 0; d < tree.length; d++ )
	{
		var entry = tree[ d ];
		if ( !entry.isDirectory )
		{
			result[ '"' + entry.path + '"' ] = entry;
		}
		else if ( entry.files )
		{
			getFilesFromTree( entry.files, result );
		}
	}
	return result;
}
module.exports.getFilesFromTree = getFilesFromTree;

function getDirectoryArrayFromTree( tree, options )
{
	var result = [];
	getDirArrayFromTree( tree, result );

	if ( options.sort )
	{
		result.sort( function( a, b )
		{
			if ( a.path == b.path )
				return 0;
			if ( a.path.indexOf( b.path ) == 0 )
				return a.path.length < b.path.length ? -1 : 1;
			if ( b.path.indexOf( a.path ) == 0 )
				return b.path.length < a.path.length ? -1 : 1;
			return 0;
		} );
	}
	return result;
}
function getDirArrayFromTree( tree, result )
{
	result = typeof result == 'undefined' ? [] : result;
	for ( var d = 0; d < tree.length; d++ )
	{
		var entry = tree[ d ];
		if ( entry.isDirectory )
		{
			result.push( entry );
			if ( entry.files )
				getDirArrayFromTree( entry.files, result );
		}
	}
	return result;
}
module.exports.getDirectoryArrayFromTree = getDirectoryArrayFromTree;
function getFileArrayFromTree( tree, result )
{
	if ( !result )
		result = [];
	for ( var d = 0; d < tree.length; d++ )
	{
		var entry = tree[ d ];
		if ( !entry.isDirectory )
		{
			result.push( entry );
		}
		else if ( entry.files )
		{
			getFileArrayFromTree( entry.files, result );
		}
	}
	return result;
}
module.exports.getFileArrayFromTree = getFileArrayFromTree;

function getDirectoryString( path )
{
	if ( path && path.length > 0 )
	{
		var last = path.charAt( path.length - 1 );
		if ( last == '/' || last == '\\' )
			path = path.substring( 0, path.length - 1 );
		try
		{
			if ( FS.existsSync( path ) )
			{
				var stats = FS.statSync( path );
				if ( stats && stats.isDirectory() )
					return path;
			}
		}
		catch( e )
		{
			console.log( 'ERROR: Path not found...' + path );
			return path;
		}
		return PATH.dirname( path );
	}
	return path;
}
module.exports.getDirectoryString = getDirectoryString;

function deleteDirectory( destinationPath, options, tree, count )
{
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'deleting_directory', [ destinationPath ] );

	try
	{
		if ( !tree )
		{
			if ( FS.existsSync( destinationPath ) )
			{
				tree = getDirectory( destinationPath, options );
				if ( !tree )
				{
					if ( options.catch )
						MESSAGES.pushError( { compilerError: 'missing_folder', parameter: destinationPath } ) ;
					return;
				}
			}
			count = 0;
		}
		for ( var f in tree )
		{
			var file = tree[ f ];
			if ( !file.isDirectory )
				FS.unlinkSync( file.path );
			else
			{
				if ( options.recursive )
				{
					count++;
					deleteDirectory( file.path, options, file.files, count );
					count--;
				}
			}
		}
		if ( count > 0 || !options.keepRoot )
			FS.rmdirSync( destinationPath );
	}
	catch( error )
	{
		if ( options.catch )
		{
			if ( !file.isDirectory )
				MESSAGES.pushError( { compilerError: 'cannot_delete_file', parameter: file.path } );
			else
				MESSAGES.pushError( { compilerError: 'cannot_delete_directoty', parameter: file.path } );
		}
	}
};
module.exports.deleteDirectory = deleteDirectory;

function copyDirectory( destination, source, options )
{
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'copying_directory', [ source, destination ] );

	try
	{
		// Clean source path
		source = cleanPath( source );
		destination = cleanPath( destination );

		// Create destination directory
		MKDIRP.sync( destination );

		// Copy files
		var files = getDirectory( source, options );
		if ( files )
		{
			for ( var f = 0; f < files.length; f++ )
			{
				var file = files[ f ];
				var subPath = file.path.substring( source.length + 1 );
				var dPath = destination + '/' + subPath;
				if ( !file.isDirectory )
				{
					FS.copyFileSync( file.path, dPath );
				}
				else if ( options.recursive )
				{
					copyDirectory( dPath, file.path, options );
				}
			}
		}
	}
	catch( err )
	{
		MESSAGES.pushError( { compilerError: 'cannot_copy_directory', parameter: source } );
	}
}
module.exports.copyDirectory = copyDirectory;

function copyFile( destination, source )
{
	try
	{
		MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'copying_file', [ PATH.basename( source ), PATH.dirname( destination ) ] );

		// Clean source path
		source = cleanPath( source );
		destination = cleanPath( destination );
		FS.copyFileSync( source, destination );
	}
	catch( err )
	{
		MESSAGES.pushError( { compilerError: 'cannot_copy_file', parameter: source } );
	}
}
module.exports.copyFile = copyFile;

function isAbsolutePath( path )
{
	if ( path.charAt( 0 ) == '/' || path.charAt( 0 ) == '\\' )
		return true;
	if ( path.indexOf( ':' ) >= 0 )
		return true;
	return false;
}
module.exports.isAbsolutePath = isAbsolutePath;

function isFile( path )
{
	try
	{
		var stats = FS.statSync( sPath );
		return stats.isFile();
	}
	catch( e )
	{
		MESSAGES.pushError( { compilerError: 'file_not_found', parameter: path } );
	}
}
module.exports.isFile = isFile;

function isDirectory( path )
{
	try
	{
		var stats = FS.statSync( sPath );
		return stats.isDirectory();
	}
	catch( e )
	{
		MESSAGES.pushError( { compilerError: 'directory_not_found', parameter: path } );
	}
}
module.exports.isDirectory = isDirectory;

var resourceFolderTree = undefined;
function getResourceFolderFromExtension( path, options )
{
	var token;

	// Find the folders in the resource directories, as the name can vary...
	if ( !resourceFolderTree )
	{
		resourceFolderTree = { source: {}, destination: {} };
		var tree = getDirectory( options.sourcePath + '/resources', { recursive: false } );
		if ( !tree )
		{
			MESSAGES.pushError( { compilerError: 'directory_not_found', parameter: options.sourcePath + '/resources' } );
			return undefined;
		}
		for ( token in tree )
		{
			var file = tree[ token ];
			var name = file.name.toLowerCase();
			if ( name.indexOf( 'images' ) >= 0 )			
			{
				resourceFolderTree.source[ 'images' ] = options.sourcePath + '/resources/' + file.name;
				resourceFolderTree.destination[ 'images' ] = options.destinationPath + '/resources/' + file.name;
			}
			else if ( name.indexOf( 'icons' ) >= 0 )
			{
				resourceFolderTree.source[ 'icons' ] = options.sourcePath + '/resources/' + file.name;
				resourceFolderTree.destination[ 'icons' ] = options.destinationPath + '/resources/' + file.name;
			}
			else if ( name.indexOf( '3D' ) >= 0 )
			{
				resourceFolderTree.source[ '3D' ] = options.sourcePath + '/resources/' + file.name;
				resourceFolderTree.destination[ '3D' ] = options.destinationPath + '/resources/' + file.name;
			}
			else if ( name.indexOf( 'musics' ) >= 0 )
			{
				resourceFolderTree.source[ 'musics' ] = options.sourcePath + '/resources/' + file.name;
				resourceFolderTree.destination[ 'musics' ] = options.destinationPath + '/resources/' + file.name;
			}
			else if ( name.indexOf( 'sounds' ) >= 0 )
			{
				resourceFolderTree.source[ 'sounds' ] = options.sourcePath + '/resources/' + file.name;
				resourceFolderTree.destination[ 'sounds' ] = options.destinationPath + '/resources/' + file.name;
			}
		}
	}
	resourceFolderTree.destination[ 'application/filesystem' ] = options.destinationPath + '/resources/filesystem/application';
	resourceFolderTree.source[ 'application/filesystem' ] = options.sourcePath + '/resources/filesystem/application';

	// Get the folder depending on the file extension...
	var extension = getFileExtension( path );
	switch( extension.toLowerCase() )
	{
		case 'png':
		case 'jpg':
		case 'jpeg':
		case 'svg':
			token = 'images';
			break;
		case 'gltf':
		case 'glb':
		case 'obj':
		case 'fbx':
		case 'dae':
		case 'aoz3d':
			token = '3D';
			break;
		case 'ico':
			token = 'icons';
			break;
		case 'wav':
		case 'mp3':
		case 'ogg':
			token = 'sounds';
			break;
		case 'mod':
		case 'med':
		case 'mid':
		case 'midi':
			token = 'musics';
			break;
		default:
			token = 'application/filesystem';
			break;							
	}
	return { token: token, sourcePath: resourceFolderTree.source[ token ], destinationPath: resourceFolderTree.destination[ token ] };
}
module.exports.getResourceFolderFromExtension = getResourceFolderFromExtension;

function cleanPath( path )
{
	if ( typeof path == 'undefined' )
		return path;

	var pos = 0;
	while( ( pos = path.indexOf( '\\', pos ) )  >= 0 )
		path = path.substring( 0, pos ) + '/' + path.substring( pos + 1 );
	if ( path.charAt( path.length - 1 ) == '/' )
		path = path.substring( 0, path.length - 1 );
	return path;
};
module.exports.cleanPath = cleanPath;

function getDirectoriesFromPath( path )
{
	var filename = getFilename( path );
	filename = path.substring( 0, path.length - filename.length );
	if ( filename.charAt( filename.length - 1 ) == '/' )
		filename = filename.substring( 0, filename.length - 1 );
	var pos =  filename.indexOf( ':' );
	if ( pos >= 0 )
		filename = filename.substring( pos + 1 );
	if ( filename.charAt( 0 ) == '/' )
		filename = filename.substring( 1 );
	return filename;
};
module.exports.getDirectoriesFromPath = getDirectoriesFromPath;

function getDirectoryFromPath( path )
{
	var filename = getFilenameAndExtension( path );
	filename = path.substring( 0, path.length - filename.length );
	if ( filename.charAt( filename.length - 1 ) == '/' )
		filename = filename.substring( 0, filename.length - 1 );
	return filename;
};
module.exports.getDirectoryFromPath = getDirectoryFromPath;

function getFileExtension( path )
{
	var result = PATH.extname( path );
	if ( result != '' && result.charAt( 0 ) == '.' )
		result = result.substring( 1 );
	return result;
};
module.exports.getFileExtension = getFileExtension;

function getFilename( path )
{
	path = cleanPath( path );
	var basename = PATH.basename( path );
	return basename.substring( 0, basename.length - PATH.extname( path ).length );
};
module.exports.getFilename = getFilename;

function getFilenameAndExtension( path )
{
	return PATH.basename( cleanPath( path ) );
};
module.exports.getFilenameAndExtension = getFilenameAndExtension;


function splitPath( path )
{
	var path = cleanPath( path );
	var result =
	{
		drive: '',
		directories: [],
		filename: '',
		extension: ''
	};
	
	if( path == undefined )
	{
		return result;
	}
	
	var pDrive = path.indexOf( ':' );
	if ( pDrive >= 0 )
	{
		result.drive = path.substring( 0, pDrive );
		path = path.substring( pDrive + 1 );
	}

	var pSlash = path.indexOf( '/' );
	if ( pSlash == 0 )
		path = path.substring( 1 );
	while( true )
	{
		pSlash = path.indexOf( '/' );
		if ( pSlash < 0 )
		{
			result.filename = getFilename( path );
			result.extension = getFileExtension( path );
			break;
		}
		result.directories.push( path.substring( 0, pSlash ) );
		path = path.substring( pSlash + 1 );
	};
	return result;
}
module.exports.splitPath = splitPath;

function loadFile( path, options )
{
	var result = loadIfExist( path, options );
	if ( !result && ( options.noError == undefined || !options.noError )  )
	{
		MESSAGES.pushError( { compilerError: 'cannot_load_file', parameter: path } );
	}
	return result;
}
module.exports.loadFile = loadFile;

function loadIfExist( path, options )
{
	if ( FS.existsSync( path ) )
	{
		MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'loading_file', path );
		if ( options.encoding == 'utf8' )
		{
			try
			{
				result = FS.readFileSync( path, { encoding: 'utf8' } );
				return result;
			}
			catch( err )
			{
				return null;
			}
		}
		else if ( options.encoding == 'arraybuffer' )
		{
			try
			{
				result = FS.readFileSync( path );
				return result;
			}
			catch( err )
			{
				return null;
			}
		}
	}
	return null;
}
module.exports.loadIfExist = loadIfExist;

function isStatsIdentical( stats1, stats2 )
{
	if ( !stats1 || !stats2 )
		return false;
	if ( typeof stats1.size == 'undefined' || typeof stats2.size == 'undefined' )
		return false;
	if ( typeof stats1.mtimeMs == 'undefined' || typeof stats2.mtimeMs == 'undefined' )
		return false;
	return ( stats1.size == stats2.size && stats1.mtimeMs == stats2.mtimeMs );
}
module.exports.isStatsIdentical = isStatsIdentical;
function loadStats( path )
{
	var stats = {};
	try
	{
		stats = FS.statSync( path );
	}
	catch ( err )
	{}
	return stats;
}
module.exports.loadStats = loadStats;
function statsIfExists( path )
{
	var stats = undefined;
	//if ( FS.existsSync( path ) )
	{
		try
		{
			stats = FS.statSync( path );
		}
		catch ( err )
		{}
	}
	return stats;
};
module.exports.statsIfExists = statsIfExists;

function createDirectories( path )
{
	//if ( path.substring( path, path.length - 1 ) != '/' && path.substring( path, path.length - 1 ) != '\\' )
	//	path = path + '/';
	if ( !FS.existsSync( path ) )
	{
		try
		{
			MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'creating_directory', path );
			MKDIRP.sync( path );
		}
		catch( e )
		{
			MESSAGES.pushError( { compilerError: 'cannot_create_directory', parameter: path } );
		}
	}
}
module.exports.createDirectories = createDirectories;

function isWildCard( name, wildCard )
{
	var wildPos = 0;
	var pos = 0;
	while( pos < name.length && wildPos < wildCard.length )
	{
		var c = name.charAt( pos++ );
		var wildChar = wildCard.charAt( wildPos );	
		if ( wildChar == '*' )
			return true;
		else if ( wildChar == '?' )
		{
			wildPos++;
		}
		else
		{
			if ( c != wildChar )
				return false;
			wildPos++;
		}		
	}
	if ( pos == name.length && wildPos == wildCard.length )
		return true;
	return false;
}	
module.exports.isWildCard = isWildCard;



//
// String utilities
//
var uniqueIdentifiers = {};
module.exports.getUniqueIdentifier = function( prefix, range )
{
	if ( !uniqueIdentifiers[ prefix ] )
		uniqueIdentifiers[ prefix ] = [];
	range = range ? range : 1000;

	for ( var count = 0; count < range; count++ )
	{
		var identifier = prefix + '_' + count;
		if ( !uniqueIdentifiers[ prefix ][ identifier ] )
		{
			uniqueIdentifiers[ prefix ][ identifier ] = true;
			return identifier;
		}
	}
	MESSAGES.pushError( { compilerWarning: 'out_of_unique_identifiers', parameter: prefix } );
	return prefix + '_out_of_unique_identifiers';
};
module.exports.extractCode = function( source, mark )
{
	var start = source.indexOf( '<' + mark + '-START>' );
	var end = source.indexOf( '<' + mark + '-END>' );
	if ( start >= 0 && end >= start )
	{
		var text = source.substring( start, end );
		var firstLine = findNextLine( text, findEndOfLine( text, 0 ) );
		var lastLine = findStartOfLine( text, text.length - 1 );
		return text.substring( firstLine, lastLine );
	}
	return '';
};

function findEndOfLine( text, pos )
{
	if ( pos >= text.length )
		return text.length;

	var pos = text.indexOf( '\n', pos );
	if ( pos < 0 )
		return text.length;

	var cariageReturn = 0;
	var cr = text.indexOf( '\r' );
	if ( cr >= 0 && cr < text.indexOf( '\n' ) )
		cariageReturn = 1;
/*
	var p = pos;
	while ( p >= 0 )
	{
		if ( text.charAt( p - 1 - cariageReturn ) != '\\' )
			break;
		pos = p + 1;
		p = text.indexOf( '\n', pos );
	}
*/
	return pos - cariageReturn;
	/*
	var p1 = text.indexOf( '\r\n', pos );
	var p2 = text.indexOf( '\n', pos );
	if ( p1 >= 0 && p2 >= 0 )
	{
		if ( p2 == p1 + 1 )
			return p1;
		if ( p2 < p1 )
			return p2;
		return p1;
	}
	if ( p1 >= 0 )
		return p1;
	if ( p2 >= 0 )
		return p2;
	return text.length;
	*/
};
module.exports.findEndOfLine = findEndOfLine;

function findNextLine( text, pos )
{
	if ( pos >= text.length )
		return 0;

	var result = text.indexOf( '\n', pos );
	if ( result >= 0 )
		return result + 1;
	return 0;
};
module.exports.findNextLine = findNextLine;

function findStartOfLine( text, pos )
{
	while( text.charCodeAt( pos ) != 10 && pos > 0 )
		pos--;
	pos = Math.max( 0, pos );
	if ( pos > 0 )
		pos++;
		return pos;
};
module.exports.findStartOfLine = findStartOfLine;

function trimString( str, position )
{
	var start = 0;
	position = typeof position == 'undefined' ? { left: true, right: true } : position;
	if ( position.left )
	{
		while( start < str.length && ( str.charCodeAt( start ) == 32 || str.charCodeAt( start ) == 9 || str.charCodeAt( start ) == 10 || str.charCodeAt( start ) == 13 ) )
			start++;
	}
	var end = str.length;
	if ( position.right )
	{
		while( end > 0 && ( str.charCodeAt( end - 1 ) == 32 || str.charCodeAt( end - 1 ) == 9 || str.charCodeAt( end - 1 ) == 10 || str.charCodeAt( end - 1 ) == 13 ) )
			end--;
	}
	if ( end > start )
		return str.substring( start, end );
	return '';
}
module.exports.trimString = trimString;

function extractString( text, basicRemarks )
{
	var result = '';
	var position = 0;
	text = trimString( text, { left: true } );
	var quote = text.charAt( position );
	if ( getCharacterType( quote ) == 'quote' || ( getCharacterType( quote ) == 'remark' && !basicRemarks ) )
	{
		position++;
		while( position < text.length )
		{
			var c = text.charAt( position++ );
			if ( c == '\\' )
			{
				result += '\\\\';
				continue;
			}
			else if ( c == quote )
			{
				return result;
			}
			result += c;
		}
	}
	return result;
};
module.exports.extractString = extractString;

function printLine( str )
{
	var result = '';
	for ( var p = 0; p < str.length; p++ )
	{
		if ( str.charAt( p ) == '\t' )
			result += '    ';
		else
			result += str.charAt( p );
	}
	return result;
}
module.exports.printLine = printLine;

function replaceSpacesByUnderscores( str )
{
	return replaceCharByChar( str, ' ', '_' );
};
module.exports.replaceSpacesByUnderscores = replaceSpacesByUnderscores;

function replaceCharsByChar( str, chars, char2 )
{
	for ( var c = 0; c < chars.length; c++ )
		str = replaceCharByChar( str, chars[ c ], char2 );
	return str;
};
module.exports.replaceCharsByChar = replaceCharsByChar;

function replaceCharByChar( str, char1, char2 )
{
	var result = '';
	for ( var p = 0; p < str.length; p++ )
	{
		var c = str.charAt( p );
		if ( c == char1 )
			result += char2;
		else
			result += c;
	}
	return result;
}
module.exports.replaceCharByChar = replaceCharByChar;

function replaceStringInText( text, mark, replacement )
{
	var pos = text.indexOf( mark );
	replacement = '' + replacement;
	if ( replacement.indexOf( mark ) < 0 )
	{		
	while( pos >= 0 )
	{
		text = text.substring( 0, pos ) + replacement + text.substring( pos + mark.length );
		pos = text.indexOf( mark );
	}
	}
	return text;
 };
module.exports.replaceStringInText = replaceStringInText;

function replaceParameter( text, mark, replacement )
{
	var found = true;
	var pos = text.indexOf( mark );
	while( pos >= 0 && found )
	{
		found = false;
		var type = getCharacterType( text.charAt( pos + mark.length ) );
		if ( type != 'letter' && type != 'number' )
		{
			text = text.substring( 0, pos ) + replacement + text.substring( pos + mark.length );
			found = true;
		}
		pos = text.indexOf( mark );
	}
	return text;
};
module.exports.replaceParameter = replaceParameter;

function getTag( text, tags )
{
	if ( tags )
	{
		text = text.toLowerCase();
		for ( var t = 0; t < tags.length; t++ )
		{
			if ( text.indexOf( '#' + tags[ t ].toLowerCase() ) >= 0 )
			{
				return tags[ t ];
			}
		}
	}
	return '';
};
module.exports.getTag = getTag;

function isTag( text, tags )
{
	var pos;
	tags = !isArray( tags ) ? [ tags ] : tags;
	text = text.toLowerCase();
	for ( var t = 0; t < tags.length; t++ )
	{
		if ( ( pos = text.indexOf( '#' + tags[ t ] ) ) >= 0 )
		{
			pos += tags[ t ].length + 1;
			if ( pos >= text.length || getCharacterType( pos ) != 'letter' )
				return true;
		}
	}
	return false;
};
module.exports.isTag = isTag;

function getTagParameter( text, tag, type )
{
	text = text.toLowerCase();
	var start = text.indexOf( '#' + tag.toLowerCase() );
	if ( start >= 0 )
	{
		start += tag.length + 1;
		if ( text.charAt( start ) == ':' )
		{
			start++;
			var end = text.indexOf( ',', start );
			if ( end < 0 ) end = text.length;
			var param = skipSpaces( text.substring( start, end ) );
			if ( param.charAt( 0 ) == '"' || param.charAt( 0 ) == "'"  || param.charAt( 0 ) == '“' )
			{
				if ( type == 'number' )
					return undefined;
				return param.substring( 1, param.length - 1 );
			}
			if ( type == 'string' )
				return undefined;
			var number = val( param );
			if ( !isNaN( number ) )
				return number;
			return param;
		}
	}
	return undefined;
};
module.exports.getTagParameter = getTagParameter;

function scanSourceForTexts( source, toFind, options )
{
	options = typeof options == 'undefined' ? {} : options;
	var result = [];

	// Spot all places in the source with the keywords.
	var found = [];
	var sourceOriginal = source;
	if ( !options.caseSensitive )
		source = source.toLowerCase();
	for ( var f = 0; f < toFind.length; f++ )
	{
		var find = options.caseSensitive ? toFind[ f ] : toFind[ f ].toLowerCase();
		var position = source.indexOf( find, position );
		while ( position >= 0 )
		{
			var end = this.findEndOfLine( source, position );

			// Check if at start of line
			var ok = true;
			if ( options.checkPosition == 'first' )
			{
				var startOfLine = findStartOfLine( source, position );
				if ( startOfLine > 0 )
				{
					for ( var p = startOfLine; p < position; p++ )
			{
						var c = source.charAt( p );
						if ( c != ' ' && c != '\t' )
				{
							ok = false;
					position = source.indexOf( find, end );
							break;
				}
					}
				}
			}
			if ( !ok )
				continue;

			var text = sourceOriginal.substring( position + find.length, end ).trim();

			// Must have a character at the end?
			ok = true;
			if ( options.checkEndChars )
			{
				ok = false;
				var c = text.charAt( 0 );
				for ( var cc = 0; cc < options.checkEndChars.length; cc++ )
				{
					if ( c == options.checkEndChars[ cc ] )
					{
				text = text.substring( 1 ).trim();
						ok = true;
						break;
					}
			}
			}
			if ( ok )
			{
				// Found!
			found.push( { token: toFind[ f ], text: text, start: position, end: end } );
			}
			position = source.indexOf( find, end );
		}
	}

	// Find the inactive portions in the source...
	if ( found.length > 0 )
	{
		var position = 0;
		var inactives = [];
		while ( position < source.length )
		{
			var c = source.charAt( position );
			switch ( c )
			{
				case '"':
				case '(':
				case '[':
				case 'r':
				case 'R':
				case '/':
				case "'":
					var start = position;
					if ( skipZone( c ) )
						inactives.push( { start: start, end: position } );
					continue;
				default:
					break;
			}
			position++;
		}

		// Keep only the active zones
		for ( var f = 0; f < found.length; f++ )
		{
			var find = found[ f ];
			var inactive = false;
			for ( var i = 0; i < inactives.length; i++ )
			{
				if ( find.start >= inactives[ i ].start && find.end <= inactives[ i ].end )
				{
					inactive = true;
					break;
				}
			}
			if ( !inactive )
				result.push( find );
		}

		// Replace in source eventually
		if ( options.replaceWith )
		{
			for ( var r = 0; r < result.length; r++ )
			{
				var find = result[ r ];
				var spaces = this.getRepeatString( options.replaceWith, find.end - find.start );
				source = source.substring( 0, find.start ) + spaces + source.substring( find.end );
			}
		}
	}

	// Ouf!
	return result;

	function skipZone( open )
	{
		var close = open;
		switch ( close )
		{
			case '“':
				close = '”';
				break;
			case '(':
				close = ')';
				break;
			case '[':
				close = ']';
				break;
			case '{':
				close = '}';
				break;
			case '/':
				if ( position + 1 < source.length )
				{
					if ( source.charAt( position + 1 ) == '*' )
					{
						position = source.indexOf( '*/', position );
						if ( position < 0 )
							throw syntax_error;
						position += 2;
						return true;
					}
					else if ( source.charAt( position + 1 ) == '/' )
					{
						position = findEndOfLine( source, position );
						return true;
					}
				}
				position++;
				return false;
			case "'":
				position = findEndOfLine( source, position );
				return true;
			case 'r':
			case 'R':
				if ( position + 4 < source.length )
				{
					if ( source.substr( position, 4 ).toLowerCase() == 'rem ' )
					{
						position = findEndOfLine( source, position );
						return true;
					}
				}
				position++;
				return false;
			default:
				break;
		}

		position++;
		var bracketCount = 1;
		while ( position < source.length )
		{
			c = source.charAt( position++ );
			if ( c == close )
			{
				bracketCount--;
				if ( bracketCount == 0 )
					break;
			}
			if ( c == open )
			{
				bracketCount++;
			}
		}
		if ( position < source.length && c != close )
			throw 'syntax_error';

		return true;
	}
};
module.exports.scanSourceForTexts = scanSourceForTexts;


function getCharacterType( c )
{
	if ( c >= '0' && c <= '9' )
		type = 'number';
	else if ( c == ' ' || c == "\t" )
		type = 'space';
	else if ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == '_' )
		type = 'letter';
	else if ( c == '"'  || c == '“' )
		type = 'quote';
	else if ( c == "'" )
		type = 'remark';
	else if ( c == ':' )
		type = 'column';
	else if ( c == ';' )
		type = 'semicolumn';
	else if ( c == '-' || c == '–' )
		type = 'minus';
	else if ( c == '(' || c == ')' )
		type = 'bracket';
	else if ( c == '{' || c == '}' )
		type = 'accolade';
	else
		type = 'other';
	return type;
};
module.exports.getCharacterType = getCharacterType;

function val( value )
{
	var base = 10;
	if ( value.substring( 0, 1 ) == '$' )
	{
		value = value.substring( 1 );
		base = 16;
	}
	if ( value.substring( 0, 1 ) == '%' )
	{
		value = value.substring( 1 );
		base = 2;
	}
	return parseInt( value, base );
};
module.exports.val = val;

function skipSpaces( line, position )
{
	var position = typeof position == 'undefined' ? 0 : position;
	while ( ( line.charAt( position ) == ' ' || line.charAt( position ) == '\t' ) && position < line.length )
		position++;
	return line.substring( position );
};
module.exports.skipSpaces = skipSpaces;

function getSkipSpacePosition( line, position )
{
	var position = typeof position == 'undefined' ? 0 : position;
	while ( ( line.charAt( position ) == ' ' || line.charAt( position ) == '\t' ) && position < line.length )
		position++;
	return position;
};
module.exports.getSkipSpacePosition = getSkipSpacePosition;

function getRepeatString( str, number )
{
	var result = '';
	for ( var n = 0; n < number; n++ )
		result += str;
	return result;
};
module.exports.getRepeatString = getRepeatString;

function getFirstOccurence( text, strings, position )
{
	position = typeof position == 'undefined' ? 0 : position;
	var max = text.length;
	var positions = [];
	for ( var s = 0; s < strings.length; s++ )
	{
		positions[ s ] = text.indexOf( strings[ s ] , position );
	}
	var found;
	var first = max;
	for ( var s = 0; s < positions.length; s++ )
	{
		if ( positions[ s ] >= 0 && positions[ s ] < first )
		{
			first = positions[ s ];
			found = strings[ s ];
		}
	}
	return found ? first : -1;
};
module.exports.getFirstOccurence = getFirstOccurence;

function getSkipSpaceBefore( line, position )
{
	var position = typeof position == 'undefined' ? 0 : position;
	while ( ( line.charAt( position ) == ' ' || line.charAt( position ) == '\t' ) && position > 0 )
		position--;
	return position;
};
module.exports.getSkipSpaceBefore = getSkipSpaceBefore;




//
// Javascript utilities
//
/*
Array.prototype.extend = function ( other_array )
{
	if ( isArray( other_array ) )
    	other_array.forEach( function(v) { this.push(v) }, this );
	else
		console.log( '*** ERROR: function called with no array ***')
}
*/
function isObject( item )
{
    return typeof item != 'undefined' ? (typeof item === "object" && !Array.isArray( item ) && item !== null) : false;
};
module.exports.isObject = isObject;

function isArray( item )
{
    return typeof item != 'undefined' ? Array.isArray( item ) : false;
};
module.exports.isArray = isArray;

function compareArrays( a, b )
{
	if ( a === b ) return true;
	if ( a == null || b == null ) return false;
	if ( a.length !== b.length ) return false;
  
	for ( var i = 0; i < a.length; ++i ) 
	{
	  	if ( a[ i ] !== b[ i ] ) return false;
	}
	return true;
}
module.exports.compareArrays = compareArrays

function convertArrayBufferToString( arraybuffer )
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var bytes = new Uint8Array( arraybuffer ),
	i, len = bytes.length, base64 = "";

	for (i = 0; i < len; i+=3)
	{
		base64 += chars[bytes[i] >> 2];
		base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
		base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
		base64 += chars[bytes[i + 2] & 63];
	}

	if ((len % 3) === 2)
	{
		base64 = base64.substring(0, base64.length - 1) + "=";
	}
	else if (len % 3 === 1)
	{
		base64 = base64.substring(0, base64.length - 2) + "==";
	}
	return base64;
}
module.exports.convertArrayBufferToString = convertArrayBufferToString;

function replaceMissingProperties( destination, source )
{
	for ( var p in source )
	{
		if ( typeof destination[ p ] == 'undefined' )
		{
			destination[ p ] = source[ p ];
		}
		if ( isObject( source[ p ] ) )
		{
			replaceMissingProperties( destination[ p ], source[ p ] );
		}
	}
	return destination;
};
module.exports.replaceMissingProperties = replaceMissingProperties;

function getFormattedDate()
{
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = day + '/' + month + '/' + date.getFullYear() + "-" + hour + ":" + min + ":" + sec;

    return str;
};
module.exports.getFormattedDate = getFormattedDate;

function fixJson( json )
{
	var jsonFixed = '';
	for ( var p = 0; p < json.length; p++ )
	{
		jsonFixed += json.charAt( p );
		if ( json.charCodeAt( p ) == 13 && p + 1 < json.length && json.charCodeAt( p + 1 ) != 10 )
			jsonFixed += String.fromCharCode( 10 );
	}
	return jsonFixed;
}
module.exports.fixJson = fixJson;

function getString( str )
{
	str = trimString( str );
	var start = 0;
	var end = 0;
	var quote = str.charAt( 0 );
	var quoteEnd = ( quote == '“' ? '”' : quote );
	if ( quote == '"' || quote == "'" || quote == '“' )
	{
		for ( end = start + 1; start < str.length && str.charAt( end ) != quoteEnd; end++ ) {}
		return str.substring( start + 1, end );
	}
	return str;
}
module.exports.getString = getString;

function getNumber( str )
{
	var result =
	{
		text: "",
		float: NaN,
		integer: NaN,
		type: 'nan',
		endPosition: 0
	}
	var position = 0;
	var c = str.charAt( position );
	if ( c == '-' | c == '–' )
	{
		result.text += '-';
		c = str.charAt( ++position );
	}
	if ( getCharacterType( c ) == 'number' )
	{
		position++;
		result.text += c;
		result.type = 'integer';
		while( position < str.length )
		{
			c = str.charAt( position );
			if ( !( ( c >= '0' && c <= '9' ) || c == '.' ) )
				break;
			result.text += c;
			if ( c == '.' )
				result.type = 'float';
			position++;
		}
		if ( result.type == 'float' )
		{
			result.float = parseFloat( result.text );
			result.integer = fp2Int( result.float );
		}
		else
		{
			result.integer = parseInt( result.text );
			result.float = result.integer;
		}
	}
	else if ( c == '$' )
	{
		position++;
		result.type = 'integer';
		while( position < str.length )
		{
			c = str.charAt( position ).toUpperCase();
			if ( !( ( c >= '0' && c <= '9' ) || ( c >= 'A' && c <= 'F' ) ) )
				break;
			result.text += c;
			position++;
		}
		result.integer = parseInt( result.text, 16 );
		result.float = result.integer;
	}
	else if ( c == '%' )
	{
		position++;
		result.type = 'integer';
		while( position < str.length )
		{
			c = str.charAt( position );
			if ( c != '0' && c != '1' )
				break;
			result.text += c;
			position++;
		}
		result.integer = parseInt( result.text, 2 );
		result.float = result.integer;
	}
	result.endPosition = position;
	return result;
}
module.exports.getNumber = getNumber;

function cleanObject( obj, exclude, noCase )
{
	var temp = {};
	if ( typeof exclude == 'string' )
	{
		if ( noCase )
		{
			for ( var key in obj )
			{
				if ( typeof key != 'string' || key.toLowerCase() != exclude.toLowerCase() )
					temp[ key ] = obj[ key ];
			}
		}
		else
		{
			for ( var key in obj )
			{
				if ( key != exclude )
					temp[ key ] = obj[ key ];
			}
		}
	}
	else
	{
		for ( var key in obj )
		{
			if ( obj[ key ] && obj[ key ] != exclude )
				temp[ key ] = obj[ key ];
		}
	}
	return temp;
};
module.exports.cleanObject = cleanObject;

function removeLastComma( str )
{
	if ( str && str.length > 0 && str.charAt( str.length - 1 ) == ',' )
		return str.substring( 0, str.length - 1 );
	return str;
};
module.exports.removeLastComma = removeLastComma;

function copyObject( obj )
{
	return LOADASH.cloneDeep( obj );
};
module.exports.copyObject = copyObject;

function getManifestProperty( address, options1, options2, def )
{
	var prop = getProp( address, options1.manifest );
	if ( typeof prop == 'undefined' && options2 )
		prop = getProp( address, options2.manifest );
	if (  typeof prop == 'undefined' )
		prop = def;
	return prop;
}
module.exports.getManifestProperty = getManifestProperty;

function applyTags( destination, destinationName, tags )
{
	for ( var t in tags )
	{
		var tag = tags[ t ];
		if ( tag.domain && tag.updated )
		{
			var name = tag.domain.substring( 0, tag.domain.indexOf( '.' ) );
			if ( name == destinationName )
			{
				setProp( tag.domain.substring( tag.domain.indexOf( '.' ) + 1 ), destination, tag.value );
			}
		}
	}
}
module.exports.applyTags = applyTags;


function getProp( addr, obj )
{
	var dot = addr.indexOf( '.' );
	while ( dot >= 0 )
	{
		obj = obj[ addr.substring( 0, dot ) ];
		addr = addr.substring( dot + 1 );
		if ( typeof obj == 'undefined' )
			return obj;
		dot = addr.indexOf( '.' );
	}
	return obj[ addr ];
}
function setProp( addr, obj, value )
{
	var dot = addr.indexOf( '.' );
	while ( dot >= 0 )
	{
		obj = obj[ addr.substring( 0, dot ) ];
		addr = addr.substring( dot + 1 );
		if ( typeof obj == 'undefined' )
			return;
		dot = addr.indexOf( '.' );
	}
	if ( typeof obj[ addr ] != 'undefined' )
	{
		if ( isArray( obj[ addr ] ) )
		{
			if ( isArray( value ) )
			{
				for ( var v = 0; v < value.length; v++ )
				{
					var index = obj[ addr ].findIndex( function( e ) 
					{ 
						return e.toLowerCase() == value[ v ].toLowerCase(); 
					} );
					if ( index < 0 )
					{
						obj[ addr ].push( value[ v ] );
					}
				}
			}
			else
			{
				if ( !obj[ addr ].find( function( element ) { return element.toLowerCase() == value.toLowerCase(); } ) )
				{
					obj[ addr ].push( value );
				}
			}
		}
		else
		{
			obj[ addr ] = value;
		}
	}
	else
	{
		obj[ addr ] = value;
	}
}


//
// Image manipulation
//
function getCollisionMask( image, threeshold = 10 )
{
	var arrayBuffer = new ArrayBuffer( image.width * image.height );
	var dataView = new Uint8Array( arrayBuffer );
	for ( var y = 0; y < image.height; y++ )
	{
		for ( var x = 0; x < image.width; x++ )
		{
			if ( image.data[ ( y * image.width + x ) * 4 + 3 ] >= threeshold )
			{
				dataView[ y * image.width + x ] = 0xFF;
			}
		}
	}
	return { buffer: arrayBuffer, view: dataView, width: image.width, height: image.height };
};
module.exports.getCollisionMask = getCollisionMask;


function saveUTF8( destinationPath, source )
{
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'saving_file', destinationPath );
	destinationPath = cleanPath( destinationPath );
	try
	{
		FS.writeFileSync( destinationPath, source, { encoding: 'utf8' } );
	}
	catch( e )
	{
		MESSAGES.pushError( { compilerError: 'cannot_save_file', parameter: destinationPath } );
	}
};
module.exports.saveUTF8 = saveUTF8;

function save( destinationPath, source )
{
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'saving_file', destinationPath );
	destinationPath = cleanPath( destinationPath );
	try
	{
		FS.writeFileSync( destinationPath, source, {} );
	}
	catch( e )
	{
		MESSAGES.pushError( { compilerError: 'cannot_save_file', parameter: destinationPath } );
	}
};
module.exports.save = save;

function loadHJSON( path, options )
{
	//MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'loading_json', path );
	path = cleanPath( path );
	try
	{
		var json = loadFile( path, { encoding: 'utf8' } );
		json = fixJson( json );
		return HJSON.parse( json );
	}
	catch( e )
	{
		console.log( "LoadHJSON Parsing error:", e );
	}
	if ( options && !options.noError )
		MESSAGES.pushError( { compilerError: 'illegal_json_file', parameter: path } );
	return undefined;
}
module.exports.loadHJSON = loadHJSON;

function loadJSON( path, options )
{
	path = cleanPath( path );
	try
	{
		var json = loadFile( path, { encoding: 'utf8' } );
		return JSON.parse( json );
	}
	catch( e )
	{
		console.log( "LoadJSON Parsing error:", e );
	}
	if ( options && !options.noError )
		MESSAGES.pushError( { compilerError: 'illegal_json_file', parameter: path } );
	return undefined;
}
module.exports.loadJSON = loadJSON;

function saveJSON( path, data, options )
{
	path = cleanPath( path );
	try
	{
		var json = JSON.stringify( data );
		saveUTF8( path, json );
	}
	catch( e )
	{
		console.log( "saveJSON Stringify error:", e );
	}
	if ( options && !options.noError )
		MESSAGES.pushError( { compilerError: 'illegal_json_file', parameter: path } );
	return undefined;
}
module.exports.saveJSON = saveJSON;

function getFileHash( rootPath, path, suffix )
{
	rootPath = cleanPath( rootPath ).toLowerCase();
	path = cleanPath( path ).toLowerCase();
	if ( path.substring( 0, rootPath.length ) != rootPath )
		throw { error: 'internal_error', parameter: 'FileSave.getHash' };
	var hash = path.substring( rootPath.length );
	if ( hash.charAt( 0 ) == '/' )
		hash = hash.substring( 1 );
	hash = replaceCharsByChar( hash, [ ' ', '/', '\\', '-', '+', '.', '>', '<' ], '_' );
	return '"' + hash + suffix + '"';
};


function loadFileIfExists( path, options )
{
	var result;
	path = cleanPath( path );
	if ( FS.existsSync( path ) )
	{
		try
		{
			MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'loading_file', path );
			if ( options.encoding == 'utf8' )
			{
				result = FS.readFileSync( path, { encoding: 'utf8' } );
			}
			else if ( options.encoding == 'arraybuffer' )
			{
				result = FS.readFileSync( path );
			}
		}
		catch ( error )
		{
			MESSAGES.pushError( { compilerError: 'cannot_load_file', parameter: path } );
		}
	}
	return result;
};
module.exports.loadFileIfExists = loadFileIfExists;

function getRGBAString( r, g, b, a )
{
	var rr = r.toString( 16 );
	if ( rr.length < 2 ) rr = '0' + rr;
	var gg = g.toString( 16 );
	if ( gg.length < 2 ) gg = '0' + gg;
	var bb = b.toString( 16 );
	if ( bb.length < 2 ) bb = '0' + bb;
	var aa = '';
	if ( typeof a != 'undefined')
	{
		aa = a.toString( 16 );
		if ( aa.length < 2 ) aa = '0' + aa;
	}
	return ( '#' + rr + gg + bb + aa ).toUpperCase();
}
module.exports.getRGBAString = getRGBAString;


//
// File loader object
//
// Only load the files that have been modified
// since the last compilation...
//
function FileLoader( path, name, options )
{
	this.files = null;
	this.rootPath = cleanPath( path );
	this.errors = [];
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'fileloader_open', this.rootPath );

	// Load the files_load.hjson file
	this.jsonPath = null;
	this.previousInfos = null;
	if ( options.dataPath )
	{
		this.jsonPath = options.dataPath + '/' + replaceCharsByChar( this.rootPath, [ ' ', ':', '/', '\\', '-', '+', '.', '>', '<' ], '_' ) + name + '_loader.hjson';
		try
		{
			var json = FS.readFileSync( this.jsonPath, { encoding: 'utf8' } );
			this.previousInfos = JSON.parse( json );
		}
		catch( err ) {}
	}

	//MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'fileloader_new', this.rootPath );		
	this.files =
	{
		version: options.version,
		rootPath: this.rootPath,
		modified: false,
		infos: {},

		// "file" object
		isDirectory: true,
		path: this.rootPath,
		name: getFilenameAndExtension( this.rootPath ),
		files: getDirectory( path, options ),
		stats: {}
	};

	// Scan the directory, get all fresh stats
	var self = this;
	function scanDir( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			self.getFileInfo( file.path, { file: file } );
			if ( file.isDirectory )		
				scanDir( file.files );
		}	
	}
	
	if( this.files && this.files.files )
	{
		scanDir( this.files.files );
	}
	// Eventually load all files
	if ( options.loadFiles )
	{
		this.loadAllFiles();
	}
}
module.exports.FileLoader = FileLoader;
FileLoader.prototype.loadAllFiles = function()
{
		for ( var i in this.files.infos )
		{
			var info = this.files.infos[ i ]
			if ( !info.isDirectory )
				this.loadFile( info );
		}
};
FileLoader.prototype.close = function()
{
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'fileloader_close', this.rootPath );
	if ( this.jsonPath )
	{
		try
		{
			// Remove the content of the files
			for ( var f in this.files.infos )
				this.files.infos[ f ].data = undefined;
	
			// Save the data
			var json = JSON.stringify( this.files.infos );
			FS.writeFileSync( this.jsonPath, json, { encoding: 'utf8' } );
		}
		catch( err )
		{
			MESSAGES.pushError( { compilerError: 'cannot_write_file', parameter: this.jsonPath } );
		}
	}
};
FileLoader.prototype.getErrors = function()
{
	var errors = this.errors;
	this.errors = [];
	return errors.length == 0 ? null : errors;
};
FileLoader.prototype.getFile = function( path, options )
{
	options = typeof options == 'undefined' ? {} : options;

	var info = this.getFileInfo( path );
	if ( !info )
		return null;
	if ( !info.data )
		this.loadFile( info, options );
	if ( info.data )
	{
		var encoding = typeof options.encoding == 'undefined' ? info.encoding : options.encoding;
		if ( encoding == 'utf8' )
		{
			if ( options.returnType == 'object' )
				return HJSON.parse( info.data );
			else if ( options.returnType == 'arraybuffer' )
				return convertStringToArrayBuffer( info.data );
			return info.data;
		}
		else
		{
			if ( options.returnType == 'utf8' || options.returnType == 'arraybuffer' )
				return convertArrayBufferToString( info.data );			
		}
	}
	return info.data;
};
FileLoader.prototype.getFileInfo = function( path, options )
{
	var info;
	options = typeof options == 'undefined' ? {} : options;
	if ( isObject( path ) )
		info = path;
	else
	{
		path = cleanPath( path );
		var hash = getFileHash( this.rootPath, path, '_loader' );
		info = this.files.infos[ hash ];
		if ( !info && !options.noNew )
		{
			try
			{
				var ext = PATH.extname( path ).toLowerCase();
				info = 
				{ 
					hash: hash,
					path: path,
					isDirectory: false,
					extension: ext,
					data: null
				};
				if ( options.file )
				{
					stats = options.file.stats;
					info.isDirectory = options.file.isDirectory;
				}
				else
				{
					stats = FS.statSync( path );
					info.isDirectory = stats.isDirectory();
				}
				if ( !info.isDirectory )
				{
					info.stats = stats;
					switch ( ext )
					{
						case '.html':
						case '.css':
						case '.js':
						case '.jstemplate':
						case '.aoz':
						case '.txt':
						case '.md':
						case '.json':
						case '.hjson':
						case '.definition':
						case '.map':
							info.encoding = 'utf8';
							info.returnType = 'string';
							break;
						default:
							info.encoding = 'binary';
							info.returnType = 'arraybuffer';
							break;
					}
				}
				this.files.infos[ hash ] = info;
			}
			catch( e )
			{
				this.errors.push( e );
				MESSAGES.pushError( { compilerError: 'cannot_load_file', parameter: info.path } );
				info = null;
			}		
		}			
	}
	if ( options.loadFile && info && info.data == null )
		this.getFile( info );
	return info;
}
FileLoader.prototype.loadFileStats = function( path )
{
	var info;
	if ( isObject( path ) )
		info = path;
	else
		info = this.getFileInfo( path );
	if ( info )
	{
		try
		{
			info.stats = FS.statSync( info.path );
			return info.stats;
		}
		catch ( e )
		{
			this.errors.push( e );
			MESSAGES.pushError( { compilerError: 'cannot_load_file', parameter: info.path } );
		}
	}
	return null;
}
FileLoader.prototype.loadFile = function( path, options )
{
	var info;
	if ( isObject( path ) )
	{
		info = path;
		path = info.path;
	}
	else
		info = this.getFileInfo( path );

	if ( info )
	{	
		if ( typeof info.stats.size == 'undefined' )
			info.stats = loadStats( path );

		var encoding = info.encoding;
		var returnType = info.returnType;
		if ( options && options.returnType )
			returnType = options.returnType;
		if ( options && options.encoding )
			encoding = options.encoding;

		try
		{
			if ( encoding == 'utf8' )
			{
				info.data = FS.readFileSync( path, { encoding: 'utf8' } );
				if ( returnType == 'object' )
					info.data = HJSON.parse( info.data );
				else if ( returnType == 'arraybuffer' )
					info.data = convertStringToArrayBuffer( info.data );
			}
			else
			{
				var fd = FS.openSync( path );
				info.data = new ArrayBuffer( info.stats.size );
				var view = new Uint8Array( info.data );
				FS.readSync( fd, view, 0, info.stats.size, 0 );
				FS.closeSync( fd );
			}
			info.stats = FS.statSync( info.path );
			return info;
		}
		catch ( e )
		{
			this.errors.push( e );
			MESSAGES.pushError( { compilerError: 'cannot_load_file', parameter: info.path } );
		}
	}
	return null;
}
FileLoader.prototype.loadIfExist = function( path, options )
{
	var info = this.getFileInfo( path, { noNew: true } );
	if ( info )
		return this.loadFile( info );
	return null;
};
FileLoader.prototype.addFile = function( path )
{
	var directory, newFile;
	function findIt( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( file.isDirectory )
			{
				if ( file.path == directory )
				{
					for ( var ff = 0; ff < file.files.length; ff++ )
					{
						if ( file.files[ ff ].name == newFile.name )
							return file.files[ ff ];
					}
					file.files.push( newFile );
					return newFile;
				}	
				file = findIt( file.files );
				if ( file )
					return file;
			}
		}
		return null;
	}

	path = cleanPath( path );
	newFile = getFileInfo( path );
	directory = getDirectoryFromPath( path );
	return findIt( this.files.files );
}
FileLoader.prototype.findPath = function( path, tree )
{
	function findIt( files )
	{
		if( files && files != null )
		{
			for ( var f = 0; f < files.length; f++ )
			{
				var file = files[ f ];
				if ( file.path == path )
					return file;
				if ( file.isDirectory )
				{
					if( file.files && file.files != null )
					{
						file = findIt( file.files );
						if ( file )
							return file;
					}
				}
			}
		}
		return null;
	}

	path = cleanPath( path );
	if ( path == this.rootPath )
		return this;
	var tree = ( typeof tree != 'undefined' ? tree : this.files.files );
	return findIt( tree );
}
FileLoader.prototype.findFile = function( path, options )
{
	function findIt( files, options )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( file.path == path )
				return file;
			if ( file.isDirectory )
			{
				if ( options.recursive )
				{
					file = findIt( file.files, options );
					if ( file )
						return file;
				}
			}
		}
		return null;
	}

	path = cleanPath( path );
	options = ( typeof options == 'undefined' ? options = {} : options );
	var tree = ( typeof options.tree != 'undefined' ? options.tree : this.files.files );
	return findIt( tree, options );
}
FileLoader.prototype.getDirectoryTree = function( path, options )
{
	var found;
	path = cleanPath( path );
	if ( path == this.rootPath )
		found = this.files.files;
	else
	{
		found = this.findPath( path );
		if ( !found )
			return [];
		found = found.files;
	}
	return found;
};
FileLoader.prototype.findDirectoryFiles = function( path, options )
{
	var found;
	path = cleanPath( path );
	if ( path == this.rootPath )
		found = this.files.files;
	else
	{
		found = this.findPath( path );
		if ( !found )
			return [];
		found = found.files;
	}
	var newFiles = [];
	addDir( found, options );
	return newFiles;

	function addDir( files, options )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
			{
				if ( !options.excludes || ( options.excludes && !filterFilename( file.name, options.excludes ) ) )
				{
					if ( !options.filters || ( options.filters && filterFilename( file.name, options.filters ) ) )
					{
						newFiles.push( file );
					}
				}
			}
			else
			{
				if ( options.directories )
					newFiles.push( file );
				if ( options.recursive )
					addDir( file.files, options );
			}
		}
	}
};
FileLoader.prototype.isFileDifferent = function( path )
{
	if ( !this.previousInfos )
		return true;

	var hash = getFileHash( this.rootPath, path, '_loader' );
	var file1 = this.files.infos[ hash ];
	var file2 = this.previousFiles[ hash ];
	if ( file1 != file2 )
		return true;
	if ( file1.isDirectory != file2.isDirectory )
		return true;
	if ( !file1.isDirectory )
	{
		if ( !isStatsIdentical( file1.stats, file2.stats ) )
			return true;
	}
	return false;
};
FileLoader.prototype.isDirectoryDifferent = function( path )
{
	if ( !this.previousInfos )
		return true;

	path = cleanPath( path );

	var files1 = [];
	var files2 = [];
	for ( var f in this.files.infos )
	{
		if ( this.files.infos[ f ].path.substring( 0, path.length ) == path )
			files1.push( this.files.infos[ f ] );
	}
	for ( var f in this.previousInfos )
	{
		if ( this.previousInfos[ f ].path.substring( 0, path.length ) == path )
			files2.push( this.previousInfos[ f ] );
	}
	if ( files1.length != files2.length )
		return true;

	function doSort( f1, f2 ) 
	{
		if ( f1.path < f2.path )
			return -1;
		if ( f1.path > f2.path )
			return 1;
		return 0;
	};			
	files1.sort( doSort );
	files2.sort( doSort );

	for ( var f = 0; f < files1.length; f++ )
	{
		var file1 = files1[ f ];
		var file2 = files2[ f ];
		if ( file1.path != file2.path || file1.isDirectory != file2.isDirectory )
			return true;
		if ( !file1.isDirectory )
		{
			if ( !isStatsIdentical( file1.stats,  file2.stats ) )
				return true;
		}
	}
	return false;
}

FileLoader.prototype.updateDirectory = function( fileSaver )
{
	for ( var f in fileSaver.files.infos )
	{
		var infoLoader = fileSaver.files.infos[ f ];
		var infoSaver = this.getFileInfo( infoLoader.path );
		if ( infoSaver )
		{
			if ( !infoSaver.isDirectory )
			{
				infoSaver.stats = {};
				infoSaver.md5 = '';
				infoSaver.data = undefined;
			}
		}
	}
}

//
// File saver object
//
// Copy and save only the files that have not been modified
// since their creation...
//
function FileSaver( path, name, options )
{
	var self = this;
	var numberOfFilesModified = 0;
	function checkIt( files1, files2, reuse )
	{
		if ( files1.length == files2.length )
		{
			function doSort(  f1, f2 ) 
			{
				if ( f1.name < f2.name )
					return -1;
				if ( f1.name > f2.name )
					return 1;
				return 0;
			};			
			files1.sort( doSort );
			files2.sort( doSort );

			for ( var f = 0; f < files1.length; f++ )
			{
				var file1 = files1[ f ];
				var file2 = files2[ f ];
				if ( file1.isDirectory )
					reuse = checkIt( file1.files, file2.files, reuse );
				else				
				{
					if ( file1.path != file2.path )
						reuse = false;					
					//else
					//{
					//	file1.modified = !isStatsIdentical( file1.stats, file2.stats );
					//	if ( file1.modified )
					//		numberOfFilesModified++;
					//}
				}
			}
			return reuse;
		}
		return false;
	}
	function loadDir( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			self.getFileInfo( file.path );
			if ( file.isDirectory )
				loadDir( file.files );
		}
	}
	///////////////////////

	this.files = null;
	this.rootPath = cleanPath( path );
	this.waitingCount = 0;
	this.options = options;
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'filesaver_open', this.rootPath );

	// Load the files.hjson file
	var previousFiles = undefined;
	this.dataPath = undefined;
	if ( options.dataPath )
	{
		this.jsonPath = options.dataPath + '/' + replaceCharsByChar( this.rootPath, [ ' ', ':', '/', '\\', '-', '+', '.', '>', '<' ], '_' ) + name + '_saver.hjson';
		try
		{
			var json = FS.readFileSync( this.jsonPath, { encoding: 'utf8' } );
			previousFiles = JSON.parse( json );
		}
		catch( err ) {}
	}

	var tree = getDirectory( path, { recursive: true, directories: true } );
	if ( previousFiles )
	{
		if ( checkIt( tree, previousFiles.files, true ) )
			this.files = previousFiles;
	}
	if ( !this.files )
	{
		this.files =
		{
			version: options.version,
			rootPath: this.rootPath,
			modified: false,
			infos: {},

			// "file" object
			isDirectory: true,
			path: this.rootPath,
			name: getFilenameAndExtension( this.rootPath ),
			stats: {},
			files: tree
		};
		loadDir( this.files.files );
		MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'filesaver_new', this.rootPath );		
	}
}
module.exports.FileSaver = FileSaver;
FileSaver.prototype.close = function()
{
	MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'filesaver_close', this.rootPath );

	if ( this.jsonPath )
	{
		try
		{
			function cleanIt( files )
			{
				for ( var f in files )
				{
					var file = files[ f ];
					file.parent = undefined;
					if ( file.isDirectory )
						cleanIt( file.files );
				}
			}
			cleanIt( this.files.files );
			var json = JSON.stringify( this.files );
			FS.writeFileSync( this.jsonPath, json, { encoding: 'utf8' } );
		}
		catch( err )
		{
			MESSAGES.pushError( { compilerError: 'cannot_write_file', parameter: this.jsonPath } );
		}
	}
};
FileSaver.prototype.getFileInfo = function( path, options )
{
	var info;
	options = typeof options == 'undefined' ? {} : options;
	if ( isObject( path ) )
		info = path;
	else
	{
		path = cleanPath( path );
		var index = getFileHash( this.rootPath, path, '_loader' );
		info = this.files.infos[ index ];
		if ( !info && !options.noNew )
		{
			info = 
			{ 
				index: index,
				path: path,
				stats: loadStats( path ),
				hash: '',
				hashUnlocked: ''
			};
			var newFile = options.file ? options.file : getFileInfo( path );
			newFile.files = typeof newFile.files == 'undefined' ? [] : newFile.files;
			if ( options.insertInTree )
			{
				// Insert in tree
				var parentPath = cleanPath( PATH.resolve( path, '..' ) );
				var parentFile = this.findPath( parentPath );
				if ( parentFile )
				{
					var found;
					for ( var ff = 0; ff < parentFile.files.length; ff++ )
					{
						if ( parentFile.files[ ff ].path == newFile.path )
						{
							found = ff;
							break;
						}
					}
					if ( found )
						parentFile.files[ found ] = newFile;
					else
						parentFile.files.push( newFile );
				}
			}
			info.stats = newFile.stats;
			this.files.infos[ index ] = info;
		}			
	}
	return info;
}
FileSaver.prototype.createDirectories = function( path )
{
	// Create the actual directory eventually
	createDirectories( path );

	// Add it to the tree
	this.getFileInfo( path, { insertInTree: true } );
};
FileSaver.prototype.findDirectoryFiles = function( path, options )
{
	var found;
	path = cleanPath( path );
	if ( path == this.rootPath )
		found = this.files.files;
	else
	{
		found = this.findPath( path );
		if ( !found )
		{
			MESSAGES.pushError( { compilerError: 'cannot_load_directory', parameter: path } );
			return null;
		}
		found = found.files;
	}
	var newFiles = [];
	addDir( found, options );
	return newFiles;

	function addDir( files, options )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
			{
				if ( !options.excludes || ( options.excludes && !filterFilename( file.name, options.excludes ) ) )
				{
					if ( !options.filters || ( options.filters && filterFilename( file.name, options.filters ) ) )
					{
						newFiles.push( file );
					}
				}
			}
			else
			{
				if ( options.directories )
					newFiles.push( file );
				if ( options.recursive )
					addDir( file.files, options );
			}
		}
	}
};
FileSaver.prototype.findFile = function( path, options )
{
	function findIt( files, options )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( file.path == path )
				return file;
			if ( file.isDirectory )
			{
				if ( options.recursive )
				{
					file = findIt( file.files, options );
					if ( file )
						return file;
				}
			}
		}
		return null;
	}
	path = cleanPath( path );
	options = ( typeof options == 'undefined' ? options = {} : options );
	var tree = ( typeof options.tree == 'undefined' ? this.files.files : options.tree );
	return findIt( tree, options );
}
FileSaver.prototype.findPath = function( path, tree )
{
	function findIt( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( file.path == path )
				return file;
			if ( file.isDirectory )
			{
				file = findIt( file.files );
				if ( file )
					return file;
			}
		}
		return null;
	}
	path = cleanPath( path );
	if ( path == this.rootPath )
		return this.files;
	var tree = ( typeof tree == 'undefined' ? this.files.files : tree );
	return findIt( tree );
}
FileSaver.prototype.copyFile = function( destinationPath, sourcePath, options )
{
	options = typeof options == 'undefined' ? {} : options;
	var destinationInfo = this.getFileInfo( destinationPath, { noNew: true } );
	try
	{
		var sourceStats, sourceInfo;
		if ( options.fileLoader )
		{
			sourceInfo = options.fileLoader.getFileInfo( sourcePath, { loadFile: true } );
			sourceStats = sourceInfo.stats;
		}
		else 
			sourceStats = FS.statSync( sourcePath );	

		var doCopy = true;
		if ( destinationInfo )
			doCopy = !isStatsIdentical( sourceStats, destinationInfo.stats );
		if ( doCopy )
		{
			MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'filesaver_copying', destinationPath );
			if ( options.fileLoader )
			{ 
				var data, o;
				if ( sourceInfo.encoding == 'utf8' )
				{
					data = sourceInfo.data;
					if ( sourceInfo.returnType == 'object' )
						data = JSON.stringify( data );
					else if ( sourceInfo.returnType == 'arraybuffer' )
						data = convertArrayBufferToString( data );
					o = { encoding: 'utf8' };
				}
				else
				{
					data = new Uint8Array( sourceInfo.data );
					o = {};
				}					
				FS.writeFileSync( destinationPath, data, o );
				if ( !destinationInfo )
					destinationInfo = this.getFileInfo( destinationPath, { insertInTree: true } );
				else
					destinationInfo.stats = sourceStats;
				//sourceInfo.stats = copyObject( destinationInfo.stats );
			}
			else
			{
				FS.copyFileSync( sourcePath, destinationPath );
				if ( !destinationInfo )
					destinationInfo = this.getFileInfo( destinationPath, { insertInTree: true } );
				destinationInfo.stats = sourceStats;
			}
			if ( options.permissions )
			{
				try
				{
					FS.chmodSync( dPath, options.permissions )
				}
				catch( e )
				{
					MESSAGES.pushError( { compilerWarning: 'cannot_set_permissions', parameter: file.path } );
				}
			}
		}
	}
	catch( e )
	{
		MESSAGES.pushError( { compilerError: 'cannot_copy_file', parameter: sourcePath } );
	}
};
FileSaver.prototype.save = function( destinationPath, source, options )
{
	if ( options.encoding == 'utf8' )
	{
		this.saveUTF8( destinationPath, source );
	}
	else
	{
		var info = this.getFileInfo( destinationPath, { noNew: true } );
		var md5 = MD5( source );
		try
		{
			if ( !info || ( info && md5 != info.md5 ) )
			{
				MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'filesaver_saving', destinationPath );
				FS.writeFileSync( destinationPath, source, {} );
				if ( !info )
					info = this.getFileInfo( destinationPath, { insertInTree: true } );
				else
					info.stats = loadStats( path );
				info.md5 = md5;
			}
		}
		catch( e )
		{
			MESSAGES.pushError( { compilerError: 'cannot_copy_file', parameter: file.path } );
		}
	}
};
FileSaver.prototype.saveUTF8 = function( path, source, options )
{
	options = typeof options == 'undefined' ? {} : options;
	var info = this.getFileInfo( path, { noNew: true } );
	var md5 = MD5( source );
	try
	{
		if ( !info || ( info && info.md5 != md5 ) )
		{
			if ( options.error )
				MESSAGES.print( MESSAGES.VERBOSE_DEV3, options.error, options.errorParameter );
			else
				MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'filesaver_saving', path );

			FS.writeFileSync( path, source, { encoding: 'utf8' } );
			if ( !info )
				info = this.getFileInfo( path, { insertInTree: true } );
			else
				info.stats = loadStats( path );
			info.md5 = md5;
		}		
	}
	catch( e )
	{
		MESSAGES.pushError( { compilerError: 'cannot_save_file', parameter: path } );
	}
	return info;
};
FileSaver.prototype.copyAndUnlockImage = function( destinationPath, sourcePath, options )
{
	var destinationInfo = this.getFileInfo( destinationPath, { noNew: true } );
	try
	{
		var stats, data;
		if ( options.fileLoader )
		{
			var sourceInfo = options.fileLoader.getFileInfo( sourcePath, { loadFile: true } );
			data = sourceInfo.data;
			stats = sourceInfo.stats;
		}
		else
		{
			data = FS.readFileSync( sourcePath );
			stats = FS.statSync( sourcePath );
		}

		if ( !destinationInfo || ( destinationInfo && !isStatsIdentical( destinationInfo.stats, stats ) ) )
		{
			var text = convertArrayBufferToString( data );
			var source = 'AOZ_Files["image_' + getFilename( destinationPath ) + '"]="' + text + '";';
			destinationInfo = this.saveUTF8( destinationPath, source, { encoding: 'utf8', error: 'copying_unlock', errorParameter: [ PATH.basename( sourcePath ), PATH.dirname( destinationPath ) ] } );
			destinationInfo.stats = stats;
		}
	}
	catch( error )
	{
		MESSAGES.pushError( { compilerError: 'cannot_copy_file', parameter: sourcePath } );
	}
};
FileSaver.prototype.copyAndUnlockSound = function( destinationPath, sourcePath, options )
{
	var destinationInfo = this.getFileInfo( destinationPath, { noNew: true } );
	try
	{
		var stats, data;
		if ( options.fileLoader )
		{
			var sourceInfo = options.fileLoader.getFileInfo( sourcePath, { loadFile: true } );
			data = sourceInfo.data;
			stats = sourceInfo.stats;
		}
		else
		{
			data = FS.readFileSync( sourcePath );
			stats = FS.statSync( sourcePath );
		}

		if ( !destinationInfo || ( destinationInfo && !isStatsIdentical( destinationInfo.stats, stats ) ) )
		{
			var text = convertArrayBufferToString( data );
			var source = 'AOZ_Files["sound_' + getFilename( destinationPath ) + '"]="' + 'data:audio/wav;base64,' + text + '";';
			destinationInfo = this.saveUTF8( destinationPath, source, { encoding: 'utf8', error: 'copying_unlock', errorParameter: [ PATH.basename( sourcePath ), PATH.dirname( destinationPath ) ] } );		
			destinationInfo.stats = stats;
		}
	}
	catch( error )
	{
		MESSAGES.pushError( { compilerError: 'cannot_copy_file', parameter: sourcePath } );
	}
};
FileSaver.prototype.copyAndUnlockData = function( destinationPath, sourcePath, options )
{
	var destinationInfo = this.getFileInfo( destinationPath, { noNew: true } );
	try
	{
		var stats, data;
		if ( options.fileLoader )
		{
			var sourceInfo = options.fileLoader.getFileInfo( sourcePath, { loadFile: true } );
			data = sourceInfo.data;
			stats = sourceInfo.stats;
		}
		else
		{
			data = FS.readFileSync( sourcePath );
			stats = FS.statSync( sourcePath );
		}

		if ( !destinationInfo || ( destinationInfo && !isStatsIdentical( destinationInfo.stats, stats ) ) )
		{
			var text = convertArrayBufferToString( data );
			var source = 'AOZ_Files["bank_' + getFilename( destinationPath ) + '"]="' + text + '";';
			destinationInfo = this.saveUTF8( destinationPath, source, { encoding: 'utf8', error: 'copying_unlock', errorParameter: [ PATH.basename( sourcePath ), PATH.dirname( destinationPath ) ] } );		
			destinationInfo.stats = stats;
		}
	}
	catch( error )
	{
		MESSAGES.pushError( { compilerError: 'cannot_copy_file', parameter: sourcePath } );
	}
};
FileSaver.prototype.copyMemoryBlock = function( destinationPath, block )
{
	this.save( destinationPath, block.bufferView, { encoding: 'binary' } );
};
FileSaver.prototype.deleteFile = function( path, noError )
{
	try
	{
		MESSAGES.print( MESSAGES.VERBOSE_DEV3, 'deleting_file', [ path ] );

		var info = this.getFileInfo( path );
		FS.unlinkSync( path );
		this.files.infos = cleanObject( this.files.infos, info );
	}
	catch( e )
	{
		if ( !noError )
		MESSAGES.pushError( { compilerError: 'cannot_delete_file', parameter: path } );
	}
};
FileSaver.prototype.copyList = function( list, options )
{
	for ( var f = 0; f < list.length; f++ )
	{
		this.copyFile( list.destination, list.source, options );
	}
};
FileSaver.prototype.equateFolderToList = function( destinationPath, list, options )
{
	destinationPath = cleanPath( destinationPath );

	// Create the directory eventually
	this.createDirectories( destinationPath );

	// What is in it?
	var folder = this.findDirectoryFiles( destinationPath, options ); 
	folder = !folder ? [] : folder;				// Protection

	// Copy the files
	for ( var l = 0; l < list.length; l++ )
	{
		var path;
		var ext = getFileExtension( list[ l ].source ).toLowerCase();
		if ( options.unlock )
		{
			var jsPath;
			if ( ext == 'png' || ext == 'jpg' || ext == 'jpeg'  || ext == 'gif' || ext == "svg" )
			{
				path = list[ l ].destination.substring( 0, list[ l ].destination.length - ext.length ) + 'js';
				this.copyAndUnlockImage( path, list[ l ].source, options );
			}
			else if ( ext == 'mp3' || ext == 'wav' || ext == 'ogg' )
			{
				path = list[ l ].destination.substring( 0, list[ l ].destination.length - ext.length ) + 'js';
				this.copyAndUnlockSound( path, list[ l ].source, options );
			}
			else
			{
				path = list[ l ].destination.substring( 0, list[ l ].destination.length - ext.length ) + 'js';
				this.copyAndUnlockData( path, list[ l ].source, options );
			}
		}
		else
		{
			path = list[ l ].destination;
			this.copyFile( path, list[ l ].source, options );
		}
		path = cleanPath( path );
		for ( var f = 0; f < folder.length; f++ )
		{
			var file = folder[ f ];
			if ( file.path == path )
			{
				folder.splice( f, 1 );
				break;
			}
		}
	}

	// Delete the extra files
	for ( var f = 0; f < folder.length; f++ )
	{
		if ( !folder[ f ].isDirectory )
			this.deleteFile( folder[ f ].path );
	}
	// Delete empty directories
	// TODO! When resources structure is tree.
};
FileSaver.prototype.cleanDirectory = function( destinationPath, list, options )
{
	// Create the directory eventually
	this.createDirectories( destinationPath );

	var folder = this.findDirectoryFiles( destinationPath, options ); 
	for ( var f in folder )
	{
		for ( var l = 0; l < list.length; l++ )
		{
			if ( folder[ f ].path == list[ l ] )
			{
				folder[ f ] = null;
				break;
			}
		}
	}
	for ( var f in folder )
	{
		if ( folder[ f ] )
		{
			this.deleteFile( folder[ f ].path );
		}
	}
};

FileSaver.prototype.copyDirectory = function( destination, source, options )
{
	try
	{
		var files;
		if ( options.fileLoader )
		{
			files = options.fileLoader.findDirectoryFiles( source, options );
		}
		else
		{
			source = cleanPath( source );
			files = getDirectory( source, options );
		}

		// Create the directory
		this.createDirectories( destination );
		
		// Copy files
		if ( files )
		{
			for ( var f = 0; f < files.length; f++ )
			{
				var file = files[ f ];
				var subPath = file.path.substring( source.length + 1 );
				var dPath = destination + '/' + subPath;

				// Create directories
				var path = getDirectoryFromPath( dPath );
				var start = this.rootPath.length;
				while ( start < path.length )
				{
					var end = path.indexOf( '/', start + 1 );
					if ( end < 0 )
						end = path.length;
					if ( end == start )
						break;
					var checkPath = path.substring( 0, end );
					if ( !this.getFileInfo( checkPath, { noNew: true } ) )
						this.createDirectories( checkPath );
					start = end;
				} 

				if ( !file.isDirectory )
				{
					var copied = false;
					if ( options.toCallback )
					{
						for ( var cb = 0; cb < options.toCallback.length; cb++ )
						{
							var opt = options.toCallback[ cb ];
							if ( filterFilename( file.name, opt.filter ) )
							{
								if ( opt.encoding.toLowerCase() == 'utf8' )
								{
									var src;
									if ( !opt.noLoad )
									{
										if ( options.fileLoader )
											src = options.fileLoader.getFile( file.path );
										else
											src = loadFile( file.path, { encoding: 'utf8' } );
									}
									src = opt.callback( true, { source: src, path: file.path, destinationPath: dPath }, opt.extra );
									if ( src )
									{
										this.saveUTF8( dPath, src, options );
									}
									copied = true;
									break;
								}
								else
								{
									throw { error: 'internal_error', parameter: 'FileSaver option type' }
								}
							}
						}
					}
					if ( !copied )
					{
						this.copyFile( dPath, file.path, options );
					}
				}
				else if ( options.recursive )
				{
					this.copyDirectory( dPath, file.path, options );
				}
			}
		}
	}
	catch( err )
	{
		MESSAGES.pushError( { compilerError: 'cannot_copy_directory', parameter: source } );
	}
}

////////////////////////////////////////////////////////////////////////////
//
// Memory block class
//
////////////////////////////////////////////////////////////////////////////
function MemoryBlock( buffer, endian )
{
	if ( typeof buffer == 'number' )
		this.buffer = new ArrayBuffer( buffer );
	else
		this.buffer = buffer;
	this.bufferView = new Uint8Array( this.buffer );
	this.length = this.bufferView.byteLength;
	this.endian = typeof endian != 'undefined' ? endian : 'big';
};
module.exports.MemoryBlock = MemoryBlock;

MemoryBlock.prototype.setFromMemoryBlock = function( block, start, end )
{
	end = typeof end == 'undefined' ? block.length : end;
	if ( start < 0 || end < start || end > block.length )
		throw 'illegal_function_call';

	this.buffer = block.buffer;
	this.bufferView  = new Int8Array( block.bufferView.slice( start, end ) );
	this.length = this.bufferView.byteLength;
};

MemoryBlock.prototype.extractString = function( address, length )
{
	if ( length < 0 )
		throw 'illegal_function_call';
	if ( address + length > this.bufferView.length )
		throw 'illegal_function_call';
	var result = '';
	for ( var l = 0; l < length; l++ )
	{
		var c = this.bufferView[ address + l ];
		if ( c == 0 )
			break;
		if ( c < 32 )
			c = ' ';
		result += String.fromCharCode( c );
	}
	return result;
};
MemoryBlock.prototype.extractArrayBuffer = function( start, end )
{
	var length = end - start;
	if ( length < 0 || start + length > this.bufferView.length )
		throw 'illegal_function_call';
	var buffer = new ArrayBuffer( length );
	var view = new Uint8Array( buffer );
	for ( var l = 0; l < length; l++ )
	{
		view[ l ] = this.bufferView[ start + l ];
	}
	return buffer;
};
MemoryBlock.prototype.peek = function( address, signed )
{
	if ( address >= this.bufferView.length )
		throw 'illegal_function_call';
	if ( signed && v >= 0x80 )
		return -( 0x100 - v );
	return this.bufferView[ address ];
};
MemoryBlock.prototype.deek = function( address, signed )
{
	if ( address + 2 > this.bufferView.length )
		throw 'illegal_function_call';
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 8 | this.bufferView[ address + 1 ] & 0xFF;
	}
	else
	{
		v = ( this.bufferView[ address + 1 ] & 0xFF ) << 8 + this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x8000 )
		return -( 0x10000 - v );
	return v;
};
MemoryBlock.prototype.leek = function( address, signed )
{
	if ( address + 4 > this.bufferView.length )
		throw 'illegal_function_call';
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 24 | ( this.bufferView[ address + 1 ] & 0xFF ) << 16 | ( this.bufferView[ address + 2 ] & 0xFF ) << 8 | this.bufferView[ address + 3 ] & 0xFf;
	}
	else
	{
		v = ( this.bufferView[ address + 3 ] & 0xFF ) << 24 | ( this.bufferView[ address + 2 ] & 0xFF ) << 16 | ( this.bufferView[ address + 1 ] & 0xFF ) << 8 | this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x80000000 )
		return -( 0x100000000 - v );
	return v;
};
MemoryBlock.prototype.poke = function( address, value )
{
	if ( typeof value == 'string' )
		value = value.charCodeAt( 0 );
	value &= 0xFF;
	if ( address > this.bufferView.length )
		throw 'illegal_function_call';
	this.bufferView[ address ] = value;
};
MemoryBlock.prototype.doke = function( address, value )
{
	value &= 0xFFFF;
	if ( address + 2 > this.bufferView.length )
		throw 'illegal_function_call';
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value >> 8 ) & 0xFF;
		this.bufferView[ address + 1 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value & 0xFF ) >> 8;
	}
};
MemoryBlock.prototype.loke = function( address, value )
{
	value &= 0xFFFFFFFF;
	if ( address + 4 > this.bufferView.length )
		throw 'illegal_function_call';
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value >> 24 ) & 0xFF;
		this.bufferView[ address + 1 ] = ( value >> 16 ) & 0xFF;
		this.bufferView[ address + 2 ] = ( value  >> 8 ) & 0xFF;
		this.bufferView[ address + 3 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value  >> 8 ) & 0xFF;
		this.bufferView[ address + 2 ] = ( value  >> 16 ) & 0xFF;
		this.bufferView[ address + 3 ] = ( value  >> 24 ) & 0xFF;
	}
};
MemoryBlock.prototype.pokeArrayBuffer = function( address, buffer )
{
	var view = new Uint8Array( buffer );
	if ( address + view.length > this.bufferView.length )
		throw 'illegal_function_call';
	for ( var b = 0; b < view.length; b++ )
		this.bufferView[ address + b ] = view[ b ];
};
MemoryBlock.prototype.poke$ = function( address, text )
{
	if ( address + text.length > this.bufferView.length )
		throw 'illegal_function_call';
	for ( var p = 0; p < text.length; p++ )
		this.bufferView[ address + p ] = text.charCodeAt( p ) & 0xFF;
};
MemoryBlock.prototype.peek$ = function( address, length, stop )
{
	var text = '';
	for ( var p = 0; p < length; p++ )
	{
		var c = String.fromCharCode( this.bufferView[ address + p ] );
		if ( c == stop )
			break;
		if ( address + p > this.bufferView.length )
			throw 'illegal_function_call';
		text += c;
	}
	return text;
};
MemoryBlock.prototype.fill = function( start, end, value )
{
	var length = end - start;
	if ( length < 0 || start + length > this.bufferView.length )
		throw 'illegal_function_call';

	for ( var p = 0; p <= length - 4; p += 4 )
		this.loke( start + p, value );
	for ( ; p < length; p++ )
	{
		if ( this.endian == 'big' )
		{
			this.poke( start + p, ( value & 0xFF000000 ) >> 24 );
			value = value << 8;
		}
		else
		{
			this.poke( start + p, value & 0xFF );
			value = value >> 8;
		}
	}
};
MemoryBlock.prototype.copyTo = function( sourceAddress, destinationBlock, destinationAddress, length )
{
	if ( sourceAdress + length > this.bufferView.length || destinationAddress + length > destinationBlock.bufferView.length )
		throw 'illegal_function_call';
	if ( destinationBlock == this )
	{
		if ( destinationAddress < sourceAddress )
		{
			for ( var p = 0; p < length; p++ )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
		else
		{
			for ( var p = length - 1; p >= 0; p-- )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
	}
	else
	{
		for ( var p = length - 1; p >= 0; p-- )
			destinationBlock.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
	}
};
MemoryBlock.prototype.copyArray = function( address, sourceArray, type, length )
{
	length = typeof length == 'undefined' ? sourceArray.length : length;
	switch ( type )
	{
		default:
		case 'byte':
			for ( var p = 0; p < length; p++, address++ )
				this.poke( address, sourceArray[ p ] );
			break;``
		case 'word':
			for ( var p = 0; p < length; p++, address += 2 )
				this.doke( address, sourceArray[ p ] );
			break;
		case 'dword':
			for ( var p = 0; p < length; p++, address += 4 )
				this.loke( address, sourceArray[ p ] );
			break;
	}
};
MemoryBlock.prototype.copyFrom = function( destinationAddress, sourceBlock, sourceAddress, length )
{
	if ( destinationAddress + length > this.bufferView.length || sourceAddress + length > sourceBlock.bufferView.length )
		throw 'illegal_function_call';
	if ( sourceBlock == this )
	{
		if ( destinationAddress < sourceAddress )
		{
			for ( var p = 0; p < length; p++ )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
		else
		{
			for ( var p = length - 1; p >= 0; p-- )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
	}
	else
	{
		for ( var p = length - 1; p >= 0; p-- )
			this.bufferView[ destinationAddress + p ] = sourceBlock.bufferView[ sourceAddress + p ];
	}
};
MemoryBlock.prototype.hunt = function( start, end, text )
{
	var length = end - start;
	if ( length < 0 )
		throw 'illegal_function_call';
	if ( start + text.length > this.bufferView.length )
		return 0;
	for ( var i = 0; i < length - text.length; i++ )
	{
		for ( var j = 0; j < text.length; j++ )
		{
			if ( this.bufferView[ start + i + j ] != text.charCodeAt( j ) & 0xFF )
				break;
		}
		if ( j == text.length )
			return this.memoryHash * this.aoz.memoryHashMultiplier + i;
	}
	return 0;
};

/*
// OLD Memory block class
function MemoryBlock( buffer, endian )
{
	this.buffer = buffer;
	this.bufferView = new Uint8Array( buffer );
	this.endian = typeof endian != 'undefined' ? endian : 'big';
};
module.exports.MemoryBlock = MemoryBlock;
MemoryBlock.prototype.extractString = function( address, length )
{
	address &= 0x00FFFFFF;
	if ( length < 0 )
		throw 'illegal_function"call';
	if ( address + length > this.bufferView.length )
		throw 'illegal_function_call';
	var result = '';
	for ( var l = 0; l < length; l++ )
	{
		var c = this.bufferView[ address + l ];
		if ( c == 0 )
			break;
		if ( c < 32 )
			c = ' ';
		result += String.fromCharCode( c );
	}
	return result;
};
MemoryBlock.prototype.peek = function( address, signed )
{
	address &= 0x00FFFFFF;
	if ( address >= this.bufferView.length )
		throw 'illegal_function_call';
	if ( signed && v >= 0x80 )
		return -( 0x100 - v );
	return this.bufferView[ address ];
};
MemoryBlock.prototype.deek = function( address, signed )
{
	address &= 0x00FFFFFF;
	if ( address + 2 >= this.bufferView.length )
		throw 'illegal_function_call';
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 8 | this.bufferView[ address + 1 ] & 0xFF;
	}
	else
	{
		v = ( this.bufferView[ address + 1 ] & 0xFF ) << 8 + this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x8000 )
		return -( 0x10000 - v );
	return v;
};
MemoryBlock.prototype.leek = function( address, signed )
{
	address &= 0x00FFFFFF;
	if ( address + 4 >= this.bufferView.length )
		throw 'illegal_function_call';
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 24 | ( this.bufferView[ address + 1 ] & 0xFF ) << 16 | ( this.bufferView[ address + 2 ] & 0xFF ) << 8 | this.bufferView[ address + 3 ] & 0xFf;
	}
	else
	{
		v = ( this.bufferView[ address + 3 ] & 0xFF ) << 24 | ( this.bufferView[ address + 2 ] & 0xFF ) << 16 | ( this.bufferView[ address + 1 ] & 0xFF ) << 8 | this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x80000000 )
		return -( 0x100000000 - v );
	return v;
};
MemoryBlock.prototype.poke = function( address, value )
{
	address &= 0x00FFFFFF;
	if ( address >= this.bufferView.length )
		throw 'illegal_function_call';
	this.bufferView[ address ] = value;
};
MemoryBlock.prototype.doke = function( address, value )
{
	address &= 0x00FFFFFF;
	if ( address + 2 >= this.bufferView.length )
		throw 'illegal_function_call';
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value & 0xFF ) >> 8;
		this.bufferView[ address + 1 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value & 0xFF ) >> 8;
	}
};
MemoryBlock.prototype.loke = function( address, value )
{
	address &= 0x00FFFFFF;
	if ( address + 4 >= this.bufferView.length )
		throw 'illegal_function_call';
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value & 0xFF ) >> 24;
		this.bufferView[ address + 1 ] = ( value & 0xFF ) >> 16;
		this.bufferView[ address + 2 ] = ( value & 0xFF ) >> 8;
		this.bufferView[ address + 3 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value & 0xFF ) >> 8;
		this.bufferView[ address + 2 ] = ( value & 0xFF ) >> 16;
		this.bufferView[ address + 3 ] = ( value & 0xFF ) >> 24;
	}
};
*/

// ---------------------------------------------------------------
// Global text parser, should be in sync with runtime...
// ---------------------------------------------------------------
module.exports.AOZTEMP_position = 0;
module.exports.AOZTEMPRETURN_end_position = 0;

function extractFromString( text, start, type, throwError, parameter )
{
	module.exports.AOZTEMP_position = start;
	switch ( type )
	{
		case '(':
		case '{':
		case '[':
			var result = this.extractBracket( text, module.exports.AOZTEMP_position, type );
			if ( !result && throwError )			
				throw { error: throwError, parameter: text };
			return result;
		case 'string':
			var result = this.extractString( text, module.exports.AOZTEMP_position, parameter );
			if ( !result && throwError )
				throw { error: throwError, parameter: text };
			return result;
		case 'word':
			var result = this.extractWord( text, module.exports.AOZTEMP_position, parameter );
			if ( !result && throwError )
				throw { error: throwError, parameter: text };
			return result;
		case 'integer':
			var result = this.extractNumber( text, module.exports.AOZTEMP_position, parameter );
			if ( result.type != type && throwError )
				throw { error: throwError, parameter: text };
			return result.integer;
		case 'float':
		case 'number':
			var result = this.extractNumber( text, module.exports.AOZTEMP_position, parameter );
			if ( result.type != type && throwError )
				throw { error: throwError, parameter: text };
			return result.float;
		case 'character':
			return this.extractCharacter( text, module.exports.AOZTEMP_position, parameter );
		default:
			throw 'internal_error';
	}
};
module.exports.extractFromString = extractFromString;

function getFromString( text, start, type )
{
	var savePosition = module.exports.AOZTEMP_position;
	module.exports.AOZTEMP_position = start;
	switch ( type )
	{
		case 'string':
			result = this.extractString( text, module.exports.AOZTEMP_position );
			break;
		case 'integer':
			result = this.extractNumber( text, module.exports.AOZTEMP_position ).integer;
			break
		case 'number':
		case 'float':
			result = this.extractNumber( text, module.exports.AOZTEMP_position ).float;
			break;
		case 'character':
			result = this.extractCharacter( text, module.exports.AOZTEMP_position );
			break;
		case 'word':
			result = this.extractWord( text, module.exports.AOZTEMP_position );
			break;
		default:
			throw 'internal_error';
	}
	module.exports.AOZTEMP_position = savePosition;
	return result;
};
module.exports.getFromString = getFromString;

function skipTheSpaces( text, start )
{
	module.exports.AOZTEMP_position = start;
	while ( ( text.charAt( start ) == ' ' || text.charAt( start ) == '\t' ) && start < text.length )
		start++;
	module.exports.AOZTEMPRETURN_end_position = start;
	module.exports.AOZTEMP_position = start;
};
module.exports.skipTheSpaces = skipTheSpaces;

function extractCharacter( text, start )
{
	this.skipTheSpaces( text, start );

	var result = undefined;
	if ( module.exports.AOZTEMP_position < text.length )
		result = text.charAt( module.exports.AOZTEMP_position++ );

	module.exports.AOZTEMPRETURN_end_position = module.exports.AOZTEMP_position;
	return result;
};
module.exports.extractCharacter = extractCharacter;

function extractString( text, start, quote )
{
	var result = '';
	if ( !quote )
	{
		this.skipTheSpaces( text, start );
		start = module.exports.AOZTEMP_position;
		quote = text.charAt( start );
	}
	if ( quote == '"' || quote == "'"  || quote == '“' )
	{
		module.exports.AOZTEMP_position = start + 1;
		var ok = false;
		var quoteEnd = ( quote == '“' ? '”' : quote );
		while( module.exports.AOZTEMP_position < text.length )
		{
			var c = text.charAt( module.exports.AOZTEMP_position++ );
			if ( c == quoteEnd )
			{
				ok = true;
				break;
			}
			result += c;
		}
		if ( !ok )
			result = undefined;
	}
	module.exports.AOZTEMPRETURN_end_position = module.exports.AOZTEMP_position;
	return result;
};
module.exports.extractString = extractString;

function extractBracket( text, start, bOpen )
{
	var result = '';
	this.skipTheSpaces( text, start );
	var c = text.charAt( module.exports.AOZTEMP_position );
	if ( c == bOpen )
	{
		var bClose;
		if ( bOpen == '(' )
			bClose = ')';
		else if ( bOpen == '{' )
			bClose = '}';
		else if ( bOpen == '[' )
			bClose = ']';

		var count = 1;
		var ok = false;
		module.exports.AOZTEMP_position++;
		while( module.exports.AOZTEMP_position < text.length )
		{
			var c = text.charAt( module.exports.AOZTEMP_position++ );
			if ( c == bOpen )
				count++;
			else if ( c == bClose )
			{
				count--;
				if ( count == 0 )
				{
					ok = true;
					break;
				}
			}
			result += c;
		}
		if ( !ok )
			result = undefined;
	}
	module.exports.AOZTEMPRETURN_end_position = module.exports.AOZTEMP_position;
	return result;
};
module.exports.extractBracket = extractBracket;

function extractWord( text, start, accepted )
{
	var result = '';
	this.skipTheSpaces( text, start );
	while( module.exports.AOZTEMP_position < text.length )
	{
		var c = text.charAt( module.exports.AOZTEMP_position++ );
		if ( this.getCharacterType( c ) != 'letter' )
		{
			if ( !accepted || ( accepted && accepted.indexOf( c ) < 0 ) )
			{
			module.exports.AOZTEMP_position--;
			break;
		}
		}
		result += c;
	}
	module.exports.AOZTEMPRETURN_end_position = module.exports.AOZTEMP_position;
	return result;
};
module.exports.extractWord = extractWord;

//
// fp2Int - Return the integer portion of a floating point number.
//
function fp2Int(f)
{
	if ( f < 0 )
		return Math.ceil(f)
	else
		return Math.floor(f); // BJF
}
module.exports.fp2Int = fp2Int;

function extractNumber( line, start )
{
	this.skipTheSpaces( line, start );

	var result =
	{
		text: "",
		float: NaN,
		integer: NaN,
		type: 'nan',
		endPosition: 0
	}
	var c = line.charAt( module.exports.AOZTEMP_position );
	if ( c == '-' | c == '–' )
	{
		module.exports.AOZTEMP_position++;
		result.text += '-';
		c = line.charAt( module.exports.AOZTEMP_position );
	}
	if ( this.getCharacterType( c ) == 'number' )
	{
		module.exports.AOZTEMP_position++;
		result.text += c;
		result.type = 'integer';
		while( module.exports.AOZTEMP_position < line.length )
		{
			c = line.charAt( module.exports.AOZTEMP_position );
			if ( !( ( c >= '0' && c <= '9' ) || c == '.' ) )
				break;
			result.text += c;
			if ( c == '.' )
				result.type = 'float';
			module.exports.AOZTEMP_position++;
		}
		if ( result.type == 'float' )
		{
			result.float = parseFloat( result.text );
			result.integer = fp2Int( result.float ); // BJF
		}
		else
		{
			result.integer = parseInt( result.text );
			result.float = result.integer;
		}
	}
	else if ( c == '$' )
	{	
		module.exports.AOZTEMP_position++;
		result.type = 'integer';
		while( module.exports.AOZTEMP_position < line.length )
		{
			c = line.charAt( module.exports.AOZTEMP_position ).toUpperCase();
			if ( !( ( c >= '0' && c <= '9' ) || ( c >= 'A' && c <= 'F' ) ) )
				break;
			result.text += c;
			module.exports.AOZTEMP_position++;
		}
		result.integer = parseInt( result.text, 16 );
		result.float = result.integer;
	}
	else if ( c == '%' )
	{	
		module.exports.AOZTEMP_position++;
		result.type = 'integer';
		while( module.exports.AOZTEMP_position < line.length )
		{
			c = line.charAt( module.exports.AOZTEMP_position ).toLowerCase();
			if ( c != '0' && c != '1' ) 
				break;
			result.text += c;
			module.exports.AOZTEMP_position++;
		}
		result.integer = parseInt( result.text, 2 );
		result.float = result.integer;
	}
	result.endPosition = module.exports.AOZTEMP_position;
	module.exports.AOZTEMPRETURN_end_position = module.exports.AOZTEMP_position;
	return result;
};

module.exports.extractNumber = extractNumber;

// ---------------------------------------------------------------
// Line parser class, keep in sync with runtime-> todo, make it automatic, or shared folder
// ---------------------------------------------------------------
LineParser = function ( line, position )
{
	this.line = line;
	this.position = typeof position == 'undefined' ? 0 : position;
	this.endOfLine = false;
	this.utilities = module.exports;
};
module.exports.LineParser = LineParser;
LineParser.prototype.extractNextChar = function()
{
	if ( this.position.length < this.line.length )
		return this.line.charAt( this.position++ );
	this.endOfLine = true;
	return '';
};
LineParser.prototype.setPosition = function( position )
{
	this.position = position;
};
LineParser.prototype.get = function( type, throwError, parameter )
{
	return this.utilities.extractFromString( this.line, this.position, type, throwError, parameter );
};
LineParser.prototype.extract = function( type, throwError, parameter )
{
	var result = this.utilities.extractFromString( this.line, this.position, type, throwError, parameter );
	this.position = this.utilities.AOZTEMPRETURN_end_position;
	this.endOfLine = ( this.position >= this.line.length );
	return result;
};
LineParser.prototype.getToEndOfLine = function()
{
	if ( this.position.length < this.line.length )
		return this.line.substring( this.position );
	return '';
};
LineParser.prototype.skipSpaces = function()
{
	this.utilities.skipTheSpaces( this.line, this.position );
	this.position = this.utilities.AOZTEMPRETURN_end_position;
	this.endOfLine = ( this.position >= this.line.length );
}

// ---------------------------------------------------------------------
// New image manipulation tags (more generic)
// ---------------------------------------------------------------------
function maybeTagInLine( line )
{
	return line.indexOf( '#' ) >= 0;
}
module.exports.maybeTagInLine = maybeTagInLine

function getTagInLine( line, throwError )
{
	var syntaxError;
	if ( throwError )
		syntaxError = 'syntax_error_in_tag_definition';

	// A tag, really?
	var start = line.indexOf( '#' );
	if ( start < 0 )
		return undefined;
	var lineParser = new LineParser( line, start + 1 );

	// Tag name
	var name = '';
	var c = lineParser.extract( 'character' );
	while ( this.getCharacterType( c ) == 'letter' )
	{
		name += c;
		c = lineParser.extract( 'character' );
	};
	if ( name == '' )
		return null;
	if ( c != ':' )
	{
		if ( syntaxError )
			throw { error: syntaxError, parameter: lineParser.getToEndOfLine() };
	}

	// Parse string
	var number = 0;
	var value, type;

	// Find what is coming...
	var parameters = [];
	var type;
	while ( c == ':' && !lineParser.endOfLine )
	{
		// See what comes: bool, string or number. That is all.
		type = undefined;
		var c = lineParser.extract( 'character' );
		if ( c == '"' || c == "'"  || c == '“' )
		{
			value = lineParser.extract( 'string', syntaxError, c );
			type = 'string';
			c = lineParser.extract( 'character' );
		}
		else if ( c == '-' || c == '–' || ( c >= '0' && c <= '9' ) )
		{
			value = lineParser.extract( 'number', syntaxError );
			type = 'number';
			c = lineParser.extract( 'character' );
		}
		else
		{
			var parameter = '';
			while ( !lineParser.endOfLine && this.getCharacterType( c ) == 'letter' )
			{
				parameter += c;
				c = lineParser.extract( 'character' );
			}
			if ( this.getCharacterType( c ) == 'letter' )
				parameter += c;
			if ( parameter.toLowerCase() == 'true' )
			{
				value = true;
				type = 'bool';
			}
			else if ( parameter.toLowerCase() == 'false' )
			{
				value = false;
				type = 'bool';
			}
		}
		if ( type )
		{
			parameters.push( { value: value, type: type, number: number++ } );
		}
	};

	// Tag alone-> TRUE
	if ( typeof type == 'undefined' )
	{
		parameters.push( { value: true, type: 'bool', number: -1 } );
	}

	// Return all info.
	return { name: name, parameters: parameters };
}
module.exports.getTagInLine = getTagInLine

function getSourceText( sourceText, position, accepted, refused, options )
{
	var text = '';
	var lastText = '';
	var count = 0;
	options = typeof options == 'undefined' ? {} : options;
	while ( position < sourceText.length )
	{
		var c = sourceText.charAt( position );
		var t = getCharacterType( c );
		if ( count == 0 && options.notAtFirst )
		{
			for ( var a = 0; a < options.notAtFirst.length; a++ )
			{
				if ( c == options.notAtFirst[ a ] || t == options.notAtFirst[ a ] )
				{
					return text;
				}
			}
		}
		if ( options.skipOpen )
		{
			var openBracket, closeBracket;
			var quit  = false;
			for ( openBracket = 0; openBracket < options.skipOpen.length && !quit; openBracket++ )
			{
				if ( c == options.skipOpen[ openBracket ] )
				{
					var bracketCount = 1;
					closeBracket = options.skipClose[ openBracket ];
					openBracket = c;
					text += c;
					position++;
					while ( position < sourceText.length )
					{
						c = sourceText.charAt( position++ );
						text += c;
						if ( c == closeBracket )
						{
							bracketCount--;
							if ( bracketCount == 0 )
							{
								quit = true;
								break;
							}
						}
						if ( c == openBracket )
						{
							bracketCount++;
						}
					}
					if ( c != closeBracket )
					{
						return undefined;
					}
					continue;
				}
			}
			if ( quit )
				continue;
		}
		lastText += c;
		if ( lastText.length > 3 )
			lastText = lastText.substring( lastText.length - 3 );
		if ( lastText.length == 3 )
		{
			for ( a = 0; a < refused.length; a++ )
			{
				if ( lastText.toLowerCase() == refused[ a ] )
				{
					position -= 2;
					return text.substring( 0, text.length - 2 );
				}
			}
		}
		for ( a = 0; a < refused.length; a++ )
		{
			if ( c == refused[ a ] || t == refused[ a ] )
				return text;
		}
		var rejected = true;
		for ( a = 0; a < accepted.length; a++ )
		{
			if ( accepted[ a ] == 'any' || c == accepted[ a ] || t == accepted[ a ] )
			{
				rejected = false;
				text += c;
				break;
			}
		}
		if ( rejected )
			break;
		if ( a >= accepted.length )
			return text;
		position++;
		count++;
	}
	return text;
}
module.exports.getSourceText = getSourceText

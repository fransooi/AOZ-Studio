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
//var MKDIRP = require( 'mkdirp' );
var HJSON = require( 'hjson' );
var LOADASH = require( 'lodash' );
var PATH = require("path");
//var MD5 = require("md5");

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

function replaceStringInText( text, mark, replacement )
{
	var pos = text.indexOf( mark );
	while( pos >= 0 )
	{
		text = text.substring( 0, pos ) + replacement + text.substring( pos + mark.length );
		pos = text.indexOf( mark );
	}
	return text;
 };
module.exports.replaceStringInText = replaceStringInText;

function copyObject( obj )
{
	return LOADASH.cloneDeep( obj );
};
module.exports.copyObject = copyObject;

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

function getFileExtension( path )
{
	var result = PATH.extname( path );
	if ( result != '' && result.charAt( 0 ) == '.' )
		result = result.substring( 1 );
	return result;
};
module.exports.getFileExtension = getFileExtension;

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


//
// File utilities
//
function loadIfExist( path, options )
{
	if ( FS.existsSync( path ) )
	{
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

function loadFile( path, options )
{
	return loadIfExist( path, options );
}
module.exports.loadFile = loadFile;

function loadHJSON( path, options )
{
	path = atom.AOZIO.cleanPath( path );
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
	return undefined;
}
module.exports.loadHJSON = loadHJSON;

function getFilenameAndExtension( path )
{
	return PATH.basename( atom.AOZIO.cleanPath( path ) );
};
module.exports.getFilenameAndExtension = getFilenameAndExtension;

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
	numberOfDirectories = 0;
	numberOfFiles = 0;
	return getDir( path, options );
};
function getDir( path, options, parent )
{
	var result = [];
	path = atom.AOZIO.cleanPath( path );

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

function statsIfExists( path )
{
	var stats = undefined;
	try
	{
		stats = FS.statSync( path );
	}
	catch ( err )
	{}
	return stats;
};
module.exports.statsIfExists = statsIfExists;

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


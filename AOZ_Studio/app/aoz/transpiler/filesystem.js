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
 * File system compiler
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 22/12/2018
 */
var FS = require( 'fs' );
var UTILITIES = require( './utilities' );
var MESSAGES = require( './messages' );
var PATH = require( 'path' );
var errors;

function init( information, options )
{
	return true;
};
module.exports.init = init;

function compileFilesystem( options )
{
	var drives = [];
	var fileNumber = 0;

	// Default filesystem folder
	//compileRoot( options.drivePath );

	// Make sure a 'filesystem/application' exists
	/*
	if ( !fs.existsSync( options.sourcePath + '/resources/filesystem/application' ) )
	{
		MESSAGES.pushError( { compilerWarning: 'creating_directory', parameter: options.sourcePath + '/resources/filesystem/application' }, false );
		MKDIRP.sync( options.sourcePath + '/resources/filesystem/application'  );
	}
	*/

	// Compile folders
	compileRoot( options.sourcePath + '/resources/filesystem/' );

	// Add extra files
	for ( var name in options.filesToAddToFilesystem )
	{
		var file = options.filesToAddToFilesystem[ name ];
		if ( !file.type != 'asset' )
		{
			infos = UTILITIES.splitPath( file.path );
			addFile( infos, file.destinationPath );
		}
	}

	// Make the code!
	var code = '';
	var applicationFound = false;
	for ( var d in drives )
	{
		var drive = drives[ d ];
		first = false;
		code += '\t"' + drive.name + '":\n\t{\n\t\tsize:' + drive.size + ',\n\t\tisDirectory:true,\n\t\tisRoot:true,\n';
		createDrive( drive, '' );
		code += '\t},\n';
		if ( drive.name == options.contextName )
			applicationFound = true;
	}
	if ( !applicationFound )
	{
		code += '\t"' + options.contextName + '":\n\t{\n\t\tsize:1048576,\n\t},';
	}
	options.fileSystemTree += code;
	return true;

	function addFile( infos, path )
	{
		// The drive...
		var parent = drives[ infos.drive ];
		if ( !parent )
		{
			parent =
			{
				name: infos.drive,
				files: {},
				size: 0
			};
			drives[ infos.drive ] = parent;
		}

		// The directories
		var newPath = '';
		var slash = '';
		for ( var d = 0; d < infos.directories.length; d++ )
		{
			var subDir = infos.directories[ d ];
			newPath += slash + subDir;
			slash = '/';
			var content = parent.files[ subDir ];
			if ( !content )
			{
				content =
				{
					name: subDir,
					path: newPath,
					isDirectory: true,
					files: {}
				};
				parent.files[ subDir ] = content;
			}
			parent = content;
		}

		// The file
		if ( !parent[ file.name ] )
		{
			newPath += slash + file.name;
			var base64 = compileFile( file.path );
			if ( base64 )
			{
				parent.files[ file.name ] =
				{
					name: file.name,
					path: newPath,
					isDirectory: false,
					length: file.size,
					base64: base64,
					number: fileNumber++
				};
			}
		}
	};
	function createDrive( drive, path, first, tabs )
	{
		tabs = typeof tabs == 'undefined' ? '\t' : tabs;
		tabs += '\t';
		for ( var f in drive.files )
		{
			var file = drive.files[ f ];
			if ( file.isDirectory )
			{
				first = false;
				code += tabs + '"' + file.path.substring( path.length ) + '":\n' + tabs + '{\n';
				code += tabs + '\tname:"' + file.name + '",\n' + tabs + '\tisDirectory:true,\n';
				createDrive( file, file.path + '/', true, tabs );
				code += tabs + '},\n';
			}
		}
		if ( options.isExtension || ( !options.isExtension && options.externalFiles ) )
			options.fileSaver.createDirectories( options.destinationPath + '/resources/filesystem' );
		for ( var f in drive.files )
		{
			var file = drive.files[ f ];
			if ( !file.isDirectory )
			{
				if ( options.isExtension || ( !options.isExtension && !options.externalFiles ) )
					code += tabs + '"' + options.contextName + '_' + file.number + '":{length:' + file.length + ',base64:"' + file.base64 + '"},\n';
				else if ( options.isExtension || ( !options.isExtension && options.externalFiles ) )
				{
					code += tabs + '"' + options.contextName + '_' + file.number + '":{length:' + file.length + ',name:"' + file.name + '",number:' + file.number + ',context:"application"},\n';
					var fileCode = 'Filesdata["' + options.contextName + '_' + file.number + '"]="' + file.base64 + '";\n';
					var filePath = options.destinationPath + '/resources/filesystem/' + options.contextName + '_' + file.number + '.js';
					options.fileSaver.saveUTF8( filePath, fileCode, { } );
				}
			}
		}
	};
	function compileRoot( path )
	{
		if ( !FS.existsSync( path ) )
			return;

		var files = options.fileLoader.getDirectoryTree( path, { recursive: true, directories: true } );

		// Lower level-> drives!
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
			{
				MESSAGES.pushError( { compilerWarning: 'file_at_root_of_filesystem', parameter: file.name }, false );
			}
			else
			{
				var content = compileDrive( file.files, file.path + '/' );
				drives[ file.name ] =
				{
					name: file.name,
					files: content.content,
					size: content.size
				};
			}
		}
	};
	function compileDrive( drive, basePath, content )
	{
		var size = 1024 * 1024 * 1024;
		var content = {};
		for ( var f = 0; f < drive.length; f++ )
		{
			var file = drive[ f ];
			var path = file.path.substring( basePath.length );
			if ( !file.isDirectory )
			{
				var pos = file.name.indexOf( '.drivesize' )
				if ( pos >= 0 )
				{
					var s = parseInt( file.name.substring( 0, pos ) );
					if ( !isNaN( size ) )
						size = s;
				}
				else
				{
					var base64 = compileFile( file.path );
					if ( base64 )
					{
						content[ file.name ] =
						{
							name: file.name,
							path: path,
							isDirectory: false,
							length: file.size,
							base64: base64,
							number: fileNumber++
						};
					}
				}
			}
			else
			{
				var newContent = compileDrive( file.files, basePath );
				content[ file.name ] =
				{
					name: file.name,
					path: path,
					isDirectory: true,
					files: newContent.content
				};
			}
		}
		return { content: content, size: size };
	};
	function compileFile( path )
	{
		return options.fileLoader.getFile( path, { encoding: 'data', returnType: 'arraybuffer' } );
	};
};
module.exports.compileFilesystem = compileFilesystem;

function getFileTrees( options )
{
	if ( !options.appFilesystemTreeFlat )
	{
		var appPath = options.sourcePath + '/resources/filesystem';
		var tree = options.fileLoader.getDirectoryTree( appPath, { recursive: true } );
		if ( tree )
			options.appFilesystemTreeFlat = getFilesFromTree( tree, appPath );
	}
	if ( !options.driveTreeFlat )
	{
		var basePath = options.drivePath + '/AOZ Drive/resources';
		var tree = options.fileLoader_drive.getDirectoryTree( basePath, { recursive: true } );
		if ( tree )
			options.driveTreeFlat = getFilesFromTree( tree, basePath );
	}

	// Get all the files
	function getFilesFromTree( tree, basePath, result )
	{
		if ( !result )
			result = {};
		for ( var d = 0; d < tree.length; d++ )
		{
			var entry = tree[ d ];
			if ( !entry.isDirectory )
			{
				var infos = UTILITIES.splitPath( entry.path.substring( basePath.length ) );
				var index = infos.directories[ 0 ] + ':';
				for ( var dd = 1; dd < infos.directories.length; dd++ )
				{
					index += infos.directories[ dd ] + '/';
				}
				index += infos.filename + ( infos.extension != '' ? '.' + infos.extension : '' );
				entry.cleanPath = index;
				result[ index.toLowerCase() ] = entry;
			}
			else if ( entry.files && entry.path.toLowerCase().indexOf( '/html/' ) < 0 )
			{
				getFilesFromTree( entry.files, basePath, result );
			}
		}
		return result;
	}
};
module.exports.getFileTrees = getFileTrees;

function getAOZDriveFileInfos( path, currentDir, options )
{
	//debugger
	var result = [];
	var parts = path.split( '/' );
	var fileName = parts[ parts.length - 1 ];

	// If absolute path-> just look at one file.
	var colon = path.indexOf( ':' );
	if ( colon >= 0 )
	{
		var stats = UTILITIES.getFileInfo( path, options );
		if ( stats )
		{
			result.push( stats );
		}
		return result;
	}

	// Look for the file in the whole drive
	getFileTrees( options )
	var result = [];
	var driveFlat = options.driveTreeFlat;
	var alreadyAdded = false;
	for ( var f in driveFlat )
	{
		file = driveFlat[ f ];
		var pos = file.path.toLowerCase().indexOf( path.toLowerCase() );
		if ( pos >= 0 )
		{	
			if ( fileName == file.name )
			{
				if ( pos + path.length == file.path.length )
				{
					result.push( file );
				}
			}
		}
		else
		{
			var pos = file.path.toLowerCase().indexOf( fileName.toLowerCase() );
			if ( pos >= 0 )
			{	
				if ( fileName == file.name )
				{
					var c = file.path.charAt( pos - 1 );
					if ( c == '/' && !alreadyAdded )
					{
						result.push( file );
						alreadyAdded = true;
					}
				}
			}
		}
	}
	return result;
};
module.exports.getAOZDriveFileInfos = getAOZDriveFileInfos;

function addToFilesystem( path, options, callback, extra )
{
	// Only if the path is a string (could also be an index)
	var value = parseInt( path );
	if ( !isNaN( value ) )
		return;	

	// Path starts with a special folder?
	var colon = path.indexOf( ':' );
	var files = [];
	if ( colon >= 0 )
	{
		var drive = path.substring( 0, colon ).toLowerCase();
		path = path.substring( colon + 1 );
		colon = path.indexOf( ':' );
		var subDrive = '';
		if ( colon >= 0 )
			subDrive = path.substring( 0, colon ).toLowerCase();
		if ( subDrive == 'http' || subDrive == 'https' )
		{
			callback( true, null, extra );
			return;
		}
		switch ( drive )
		{
			case 'asset':
				files.push
				(
					{
						drive: drive,
						path: path,
						targetDir: options.sourcePath + '/resources/assets'
					}
				);
				break;
			case 'spritesheet':
				var goodPath = path;
				if ( goodPath.toLowerCase().indexOf( 'spritesheets/' ) < 0 )
					goodPath = 'spritesheets/' + goodPath;
				paths.push( goodPath );
				var ext = UTILITIES.getFileExtension( path ).toLowerCase();
				if ( ext != 'png' && ext != 'jpg' && ext != 'jpeg' && ext != 'svg' )
					return;
				files.push
				(
					{
						drive: drive,
						path: goodPath,
						targetDir: options.sourcePath + '/resources/assets'
					}
				);
				files.push
				(
					{
						drive: drive,
						path: UTILITIES.getFilename( goodPath ) + '.sprite',
						targetDir: options.sourcePath + '/resources/assets'
					}
				);
				break;
			case 'image':
				var goodPath = path;
				if ( goodPath.toLowerCase().indexOf( 'images/' ) < 0 )
					goodPath = 'images/' + goodPath;
				var filename = UTILITIES.getFilename( goodPath );
				goodPath = UTILITIES.getDirectoryFromPath( goodPath );
				files.push
				(
					{
						drive: drive,
						path: goodPath + '/' + filename + '.png',
						targetDir: UTILITIES.getResourceFolderFromExtension( 'toto.png', options ).sourcePath,
						quitOnSolve: true
					},
					{
						drive: drive,
						path: goodPath + '/' + filename + '.jpg',
						targetDir: UTILITIES.getResourceFolderFromExtension( 'toto.jpg', options ).sourcePath,
						quitOnSolve: true
					},
					{
						drive: drive,
						path: goodPath + '/' + filename + '.jpeg',
						targetDir: UTILITIES.getResourceFolderFromExtension( 'toto.jpeg', options ).sourcePath,
						quitOnSolve: true
					},
					{
						drive: drive,
						path: goodPath + '/' + filename + '.svg',
						targetDir: UTILITIES.getResourceFolderFromExtension( 'toto.svg', options ).sourcePath, 
						quitOnSolve: true
					}
				);
				break;
			case 'file':
				files.push
				(
					{
						drive: drive,
						path: path,
						targetDir: options.sourcePath + '/resources/filesystem/application'
					}
				);
				break;
			default:
				if ( drive != '' )
					return;
				files.push
				(
					{
						drive: 'file',
						path: path,
						targetDir: options.sourcePath + '/resources/filesystem/application'
					}
				);
				break;
		}
	}
	else
	{
		files.push
		(
			{
				drive: drive,
				path: path,
				targetDir: options.sourcePath + '/resources/filesystem'
			}
		);
	}

	// Get all the files from the drive and application folder
	var newFiles = [];
	for ( var f = 0; f < files.length; f++ )
	{
		var file = files[ f ];
		if ( file.targetDir )
		{
		var filename = UTILITIES.getFilenameAndExtension( file.path );
		
		// Fix target path
		if ( file.path.toLowerCase().indexOf( 'resources/' ) == 0 )
		{
			var p = file.targetDir.toLowerCase().indexOf( 'resources/' );
			if ( p >= 0 )
				file.targetDir = file.targetDir.substring( 0, p ) + file.path.substring( 0, file.path.length - filename.length - 1 );
		}
		file.targetPath = PATH.resolve( file.targetDir, filename );
		file.targetInfo = UTILITIES.getFileInfo( file.targetPath );
		
		// If destination file is not present-> compute.
		if ( !file.targetInfo )
		{
			// Find all the files with this name in the drive
			file.sourceInfos = getAOZDriveFileInfos( file.path, '', options );
			if ( file.sourceInfos.length >= 1)
			newFiles.push( file );
			}
		}
	}
	files = newFiles;

		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
		if( !FS.existsSync( file.targetPath ) )
					{
		UTILITIES.createDirectories( file.targetDir );
			UTILITIES.copyFile( file.targetPath, file.sourceInfos[ 0 ].path );
			options.fileLoader.addFile( file.targetPath );
		}
		//file.destinationPath = file.targetPath;
		//file.type = file.drive;
		//options.filesToAddToFilesystem[ 'application' ] = file;	
		MESSAGES.pushError( { compilerWarning: 'copying_file_to_filesystem', parameter: file.path } );

		if ( file.quitOnSolve )
			break;
	}
	callback( true, null, extra );
};
module.exports.addToFilesystem = addToFilesystem;

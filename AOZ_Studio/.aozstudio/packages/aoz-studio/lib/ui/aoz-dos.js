//
// DOS Interface for running applications
//
const FS = require( 'fs' );
const REMOTE = require('electron').remote;
const AOZIO = require( './../aoz-io' );
const UTILITIES = require( './../transpiler/utilities' );
const checkDiskSpace = require('check-disk-space').default;

var ATOMDos = function()
{
};
ATOMDos.prototype.getDriveList = function( options, callback, extra )
{
	var drives = AOZIO.getLocalDrives();
	var result = [];
	for ( var d = 0; d < drives.length; d++ )
		result.push( drives[ d ].path.substring( 0, drives[ d ].path.length - 1 ) );
	if ( callback )
		callback( true, result, extra );
	return result;
};
ATOMDos.prototype.open = function( args, callback, extra )
{
	var path = args.path;
	var options = args.options;
	if ( !callback )
		return FS.openSync( path, options.flags, options.mode );
	FS.open( path, options.flags, options.mode, function( err, fd )
	{
		if ( !err )
			callback( true, fd, extra );
		else
			call( false, err, extra );
	} );
};
ATOMDos.prototype.close = function( args, callback, extra )
{
	var path = args.path;
	if ( !callback )
		return FS.closeSync( path );
	FS.close( path, function( err, fd )
	{
		callback( !err, err, extra );
	} );
};
ATOMDos.prototype.exist = function( args, callback, extra )
{
	var path = args.path;
	if ( !callback )
		return FS.accessSync( path );
	FS.access( path, function( err )
	{
		callback( !err, err, extra );
	} );
};
ATOMDos.prototype.read = function( args, callback, extra )
{
	var path = args.path;
	var options = args.options;
	if ( typeof path == 'string' )
	{
		if ( !callback )
			return FS.readFileSync( path, options );
		FS.readFile( path, options, function( err, data )
		{
			if ( !err )
				callback( true, data, extra );
			else
				callback( false, err, extra );
		} );
	}
	else
	{
		if ( !callback )
			return FS.readSync( path, options );
		FS.read( path, options, function( err, bytesRead, buffer )
		{
			if ( !err )
				callback( true, bytesRead, extra );
			else
				callback( false, err, extra );
		} );
	}
};
ATOMDos.prototype.write = function( args, callback, extra )
{
	var path = args.path;
	var data = args.data;
	var options = args.options;
	if ( typeof path == 'string' )
	{
		if ( typeof data != 'string' )
			data = Buffer.from( data );
		if ( !callback )
			return FS.writeFileSync( path, data, options );
		FS.writeFile( path, data, options, function( err )
		{
			callback( !err, err, extra );
		} );
	}
	else
	{
		if ( !callback )
			return FS.writeSync( path, options.buffer, options.offset, options.length, option.position );
		FS.write( path, options.buffer, options.offset, options.length, option.position, function( err, bytesWritten )
		{
			if ( !err )
				callback( true, bytesWritten, extra );
			else
				callback( false, err, extra );
		} );
	}
};
ATOMDos.prototype.mkDir = function( args, callback, extra )
{
	var path = args.path;
	if ( !callback )
		return FS.mkdirSync( path, options );
	FS.mkdir( path, options, function( err )
	{
		callback( !err, err, extra );
	} );
};
ATOMDos.prototype.kill = function( args, callback, extra )
{
	var path = args.path;
	if ( !callback )
		return FS.unlinkSync( path );
	FS.unlink( path, function( err )
	{
		callback( !err, err, extra );
	} );
};
ATOMDos.prototype.rename = function( args, callback, extra )
{
	var newPath = args.newPath;
	var oldPath = args.oldPath;
	if ( !callback )
		return FS.renameSync( oldPath, newPath );
	FS.rename( oldPath, newPath, function( err )
	{
		callback( !err, err, extra );
	} );
};
ATOMDos.prototype.copyDirectory = function( args, callback, extra )
{
	var srcPath = args.srcPath;
	var destPath = args.destPath;
	var files = this.dir( { path: args.srcPath, options: args.options } );
	try
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
				FS.copyFileSync( srcPath + '/' + file.name, destPath + '/' + file.name, args.options.mode );
			else
				FS.mkdirSync( destPath + '/' + file.name, args.options );
		}
	}
	catch ( e )
	{
		if ( callback )
			callback( false, 'disc_error', extra );
		return 'disc_error';
	}
	callback( true, {}, extra )
	return null;
};
ATOMDos.prototype.copy = function( args, callback, extra )
{
	var srcPath = args.srcPath;
	var destPath = args.destPath;
	if ( !callback )
		return FS.copyFileSync( srcPath, destPath, options.mode );
	FS.copyFile( srcPath, destPath, options.mode, function( err )
	{
		callback( !err, err, extra );
	} );
};
ATOMDos.prototype.discInfo = function( args, callback, extra )
{
	var path = args.path;
	checkDiskSpace( path ).then( ( diskSpace ) => 
	{
		var pos = path.indexOf( ':' );
		if ( pos > 0 )
			path = path.substring( 0, pos ); 
		var result = path + ':' + diskSpace.free;
		callback( true, result, extra );
	} );
};
ATOMDos.prototype.stat = function( args, callback, extra )
{
	var path = args.path;
	if ( !callback )
		return FS.statSync( path );
	FS.stat( path, function( err, stat )
	{
		if ( !err )
			callback( true, stat, extra );
		else
			callback( false, err, extra );
	} );
};
ATOMDos.prototype.dFree = function( args, callback, extra )
{
	var path = args.path;
	// FLTODO: implement check-disk-space
	if ( !callback )
		return 0;
	callback( true, 0, extra );
};
ATOMDos.prototype.chMod = function( args, callback, extra )
{
	var path = args.path;
	var mode = args.mode;
	if ( !callback )
		return FS.chmopdSync( path, mode );
	FS.chmod( path, mode, function( err )
	{
		callback( !err, err, extra );
	} );
};
ATOMDos.prototype.chDir = function( args, callback, extra )
{
	var path = args.path;
	var previousPath = process.cwd();
	try
	{
		if ( path )
			process.chdir( path );
	}
	catch( err )
	{
		if ( callback )
			callback( false, err, extra );
		return 'disc_error';
	}
	if ( callback )
		callback( true, previousPath, extra );
	return previousPath;
};
ATOMDos.prototype.openFileRequester = function( args, callback, extra )
{
	var path = args.path;
	var options = args.options;
	if ( path )
		options.defaultPath = path;
	if ( !options.properties )
		options.properties = [ 'openFile' ];
	if ( !callback )
	{
		if ( options.type == 'save' )
			return REMOTE.dialog.showSaveDialogSync( REMOTE.getCurrentWindow(), options );	
		else
			return REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), options );
	}
	if ( options.type == 'save' )
	{
		var result = REMOTE.dialog.showSaveDialogSync( REMOTE.getCurrentWindow(), options );
			callback( typeof result != 'undefined', result, extra );
	}
	else
	{
		var result = REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), options );
			callback( typeof result != 'undefined', result, extra );
	}
};
ATOMDos.prototype.openFolderRequester = function( args, callback, extra )
{
	var path = args.path;
	var options = args.options;
	if ( path )
		options.defaultPath = path;
	if ( !options.properties )
		options.properties = [ 'openDirectory' ];
	if ( !callback )
	{
		return REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), options );
	}
	REMOTE.dialog.showOpenDialog( REMOTE.getCurrentWindow(), options, function( result )
	{
		callback( typeof result != 'undefined', result, extra );
	} );
};
ATOMDos.prototype.dirFirst = function( args, callback, extra )
{
	var path = args.path;
	var options = args.options;

	options.includeHTMLFolder = true;
	this.fileList = [];
	this.fileListPosition = 0;
	var tree = UTILITIES.getDirectory( path, options );
	if ( tree )
	{
		var files = UTILITIES.getDirectoryArrayFromTree( tree, options )
		for ( var i in files )
			this.fileList.push( files[ i ] );
		files = UTILITIES.getFilesFromTree( tree )
		for ( var i in files )
			this.fileList.push( files[ i ] );
		return this.dirNext( options, callback, extra );
	}
	if ( callback )
		callback( false, "", extra );
	return null;
};
ATOMDos.prototype.dir = function( args, callback, extra )
{
	var path = args.path;
	var options = args.options;

	options.includeHTMLFolder = true;
	this.fileList = [];
	this.fileListPosition = 0;
	var tree = UTILITIES.getDirectory( path, options );
	if ( tree )
	{
		var files = UTILITIES.getDirectoryArrayFromTree( tree, options )
		for ( var i in files )
			this.fileList.push( files[ i ] );
		files = UTILITIES.getFilesFromTree( tree )
		for ( var i in files )
			this.fileList.push( files[ i ] );
		var result = [];
		for ( var f = 0; f < this.fileList.length; f++ )
		{
			var file = this.fileList[ f ];
			var stat = { size: 0, mode : 0 };
			try
			{
				stat = FS.statSync( file.path );
			}
			catch( err )
			{
			}
			result.push(
			{
				name: file.name,
				size: stat.size,
				isDirectory: file.isDirectory,
				isFile: !file.isDirectory,
				mode: stat.mode
			} );
		}
		if ( callback )
			callback( true, result, extra );
		return result;
	}
	if ( callback )
		callback( false, "", extra );
	return null;
};
ATOMDos.prototype.dirNext = function( args, callback, extra )
{
	var result = '';
	if ( this.fileListPosition < this.fileList.length )
	{
		var stat = { size: 0, mode : 0 };
		var file = this.fileList[ this.fileListPosition++ ];
		try
		{
			stat = FS.statSync( file.path );
		}
		catch( err )
		{
		}
		result =
		{
			name: file.name,
			size: stat.size,
			isDirectory: file.isDirectory,
			isFile: !file.isDirectory,
			mode: stat.mode
		};
	}
	if ( callback )
		callback( true, result, extra );
	return result;
};

module.exports = ATOMDos;

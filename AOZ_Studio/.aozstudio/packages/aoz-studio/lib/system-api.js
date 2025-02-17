const PATH = require( 'path' );
const FS = require( 'fs' );
const MKDIRP = require( 'mkdirp' );
const REMOTE = require('electron').remote;
const EXEC = require( 'child_process' );
const JSZIP = require( 'jszip' );
const HJSON = require( 'hjson' );

var SystemAPI = new Object();
module.exports = SystemAPI;	


SystemAPI.loadJSON = function( path )
{
	var json = undefined;
	try
	{
		var data = FS.readFileSync( path );
		json = JSON.parse( data );
		return json;
	}
	catch( e )
	{
		console.error( e );
		return false;
	}
};

SystemAPI.saveJSON = function( obj, path )
{
	var json = JSON.stringify( obj );
	try
	{
		FS.writeFileSync( path, json, { encoding: 'utf8' } );
	}
	catch ( err )
	{
		console.error( err );
		return false;
	}
};

SystemAPI.loadHJSON = function( path )
{
	var hjson = undefined;
	try
	{
		var data = FS.readFileSync( path, { encoding: 'utf8' } );
		var jsonFixed = '';
		for ( var p = 0; p < data.length; p++ )
		{
			jsonFixed += data.charAt( p );
			if ( data.charCodeAt( p ) == 13 && p + 1 < data.length && data.charCodeAt( p + 1 ) != 10 )
				jsonFixed += String.fromCharCode( 10 );
		}		
		hjson = HJSON.parse( jsonFixed );
		return hjson;
	}
	catch( e )
	{
		console.error( e );
		return false;
	}	
};

SystemAPI.saveHJSON = function( obj, path )
{
	var hjson = HJSON.stringify( obj );
	try
	{
		FS.writeFileSync( path, hjson, { encoding: 'utf8' } );
	}
	catch ( err )
	{
		console.error( err );
		return false;
	}
};

SystemAPI.zipPath = function( path, zipPath, callback )
{
	var dirSep = PATH.sep;
	path = SystemAPI.cleanPath( path );
	path = path.strReplace( "\\", "/" );
	zipPath = SystemAPI.cleanPath( zipPath );
	try
	{
		var dejaErr = false;
		var zip = new JSZIP();
		var tree = SystemAPI.readDirectory( path, { recursive: true } );
		if ( tree )
		{
			
			zipIt( tree );
			
			zip.generateAsync( { type: "nodebuffer" } ).then( function( content )
			{
				FS.writeFile( zipPath, content, function( err )
				{
					if( err )
					{
						if( !dejaErr )
						{
							dejaErr = true;
							if( callback )
							{
								callback( err );
							}
						}
					}
				} );
			} );
			
			if( dejaErr )
			{
				if( callback )
				{
					callback( err );
				}
				return false;				
			}
		} 

		if( callback )
		{
			callback( "" );
		}
		return false;		
	}
	catch( err )
	{
		console.log( err );
		if( callback )
		{
			callback( err );
		}
		return false;		
	};
	
	function zipIt( tree )
	{
		for ( var f in tree )
		{
			var file = tree[ f ];
			if ( file.isDirectory )
			{
				var localPath = file.path.substring( path.length + 1 );
				zip.folder( localPath );
				zipIt( file.files );
			}
			else
			{
				var localPath = file.path.substring( path.length + 1 );
				zip.file( localPath, FS.readFileSync( file.path ), { createFolders: true } );
			}
		}		
	};
};

SystemAPI.extractZip = function( zipFile, path, callback )
{
	var zipPath = path;
	var zipPath = this.cleanPath( zipPath );
	if( !SystemAPI.isDirectory( zipPath ) )
	{	
		SystemAPI.createDirectory( zipPath );
	}
	var dirSep = PATH.sep;
	
	try
	{
		var buffer = FS.readFileSync( zipFile );
		var zip = new JSZIP();

		zip.loadAsync( buffer ).then( function( contents )
		{
			var count = 0;
			for ( var f in contents.files )
			{
				count++;
			}
			
			contents.forEach( function( relativePath, file )
			{
				if ( file.dir )
				{
					var path = zipPath + dirSep + file.name;
					
					if( !SystemAPI.isDirectory( path.strReplace( "\\", "/" ) ) )
					{
						SystemAPI.createDirectory( path.strReplace( "\\", "/" ) );
					}
					count--;
					if ( count == 0 )
					{
						if( callback )
						{
							callback( "" );
						}
					}

				}
				else
				{
					file.async( 'nodebuffer' ).then( function( content )
					{
						var dest = zipPath + '/' + file.name;
						try
						{
							setTimeout( function()
							{
								FS.writeFileSync( dest.strReplace( "\\", "/" ), content );
							}, 500 );
						}
						catch( e )
						{
							console.log( e );
						}
						count--;
						if ( count == 0 )
						{
							if( callback )
							{
								callback( "" );
							}
						}
					} );
				}
			} );
			
			if( callback )
			{
				callback( "", zipPath );
			}
		} );
	}
	catch ( e )
	{
		if( callback )
		{
			callback( e );
		}
	}
};

SystemAPI.getDirectoryFromPath = function( path )
{
	return PATH.dirname( path );
};

SystemAPI.cleanPath = function( path )
{
	var pos = 0;
	while( ( pos = path.indexOf( '\\', pos ) ) >= 0 )
		path = path.substring( 0, pos ) + '/' + path.substring( pos + 1 );
	if( path.charAt( path.length - 1 ) == '/' )
		path = path.substring( 0, path.length - 1 );
	return path;
};

SystemAPI.messageBox = function( title, message, type )
{
	var options =
	{
		message: message,
		title: title,
		type: type,
		
	};
	
	try
	{
		const response = REMOTE.dialog.showMessageBoxSync( null, options );
		return response;
	}
	catch( e )
	{
		console.warn( e );
	}
};

SystemAPI.openFileDialog = function( options )
{
	try
	{
		var path = REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), options );
		if( path && path != null )
		{
			return path[ 0 ];
		}
		else
		{
			return "-1";
		}
	}
	catch( e )
	{
		return "error";
	}
};
	
SystemAPI.saveFileDialog = function( options )
{
	try
	{
		var path = REMOTE.dialog.showSaveDialogSync( REMOTE.getCurrentWindow(), options );
		if( path && path != null )
		{
			return path;
		}
		else
		{
			return "-1";
		}
	}
	catch( e )
	{
		return "error";
	}
};
	
SystemAPI.openDirectoriesDialog = function( options )
{
	var dirSep = PATH.sep;
	try
	{
		var path = REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), options );
		
		if( path && path != null )
		{
			return path[ 0 ];
		}
		else
		{
			return "-1";
		}
	}
	catch( e )
	{
		return "error";
	}
};
	
SystemAPI.executeCommand = function( command, callback )
{
	try
	{
		return EXEC.execSync( command, { encoding: 'utf8', windowsHide: true } );
	}
	catch ( e )
	{
		console.log( e ); 
		return "error";
	}
};


SystemAPI.fileExists = function( path )
{
	try
	{
		if( FS.existsSync( path ) )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	catch( err )
	{
		return false;
	}
};

SystemAPI.getFileExtension = function( path )
{
	if( path )
	{
		var parts = path.split( "." );
		var ext = parts[ parts.length - 1 ];
		return ext.toLowerCase();
	}
	return "";
};

SystemAPI.directoryExists = function( path )
{
	try
	{
		if( FS.existsSync( path ) )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	catch( err )
	{
		return false;
	}
};
	
SystemAPI.loadFile = function( path )
{
	var content = "";
	try
	{
		if( SystemAPI.fileExists( path ) )
		{
			content = FS.readFileSync( path );
		}

		if( content == null )
		{
			return "";
		}
		else
		{
			return new Buffer( content );
		}
	}
	catch( e )
	{
		return "";
	}
};
	
SystemAPI.deleteFile = function( path, callback )
{
	try
	{
		FS.unlinkSync( path );
		if( callback )
		{
			callback( "" );
		}		
		return true;
	}
	catch( e )
	{
		if( callback )
		{
			callback( "delete_file_error" );
		}		
		return false;
	}
};

SystemAPI.saveFile = function( path, data, encoding, callback )
{
	encoding = typeof encoding == 'undefined' ? 'utf8' : encoding;
	try
	{
		FS.writeFileSync( path, data, { encoding: encoding } );
		if( callback )
		{
			callback( "" );
		}			
		return true;
	}
	catch ( err )
	{
		if( callback )
		{
			callback( "save_file_error" );
		}
		return false;
	}	
};

SystemAPI.createDirectory = function( path, callback )
{
	try
	{
		if( FS.existsSync( path ) )
		{
			if( callback )
			{
				callback( "folder_already_exists" );
			}
			return true;
		}
		
		if( process.platform == "win32" )
		{
			SystemAPI.execCommand( 'mkdir "' + path + '"', { cwd: path } );
		}
		
		if( process.platform == "darwin" )
		{
			SystemAPI.execCommand( 'mkdir \'' + path + '\'', { cwd: path } );
		}
		
		if( process.platform == "linux" )
		{
			SystemAPI.execCommand( 'mkdir \'' + path + '\'', { cwd: path } );
		}
		
		if( callback )
		{
			setTimeout( function()
			{
				callback( "" );
			}, 500 );
		}
		return true;
	}
	catch( error )
	{
		console.log( error );
		if( callback )
		{
			callback( error );
		}
		return false;
	}
};

SystemAPI.isDirectory = function( path )
{
	var dirSep = PATH.sep;
	try
	{
		var file = "file_" + Date.now();
		FS.writeFileSync( path + dirSep + file, "ok" );
		FS.unlinkSync( path + dirSep + file );
		return true
	}
	catch(e)
	{
		return false;
	}
};

SystemAPI.isFile = function( path )
{
	try
	{
		var stats = FS.statSync( path );
		return stats.isFile();
	}
	catch(e)
	{
		return false;
	}
};

SystemAPI.readDirectory = function( path, options )
{
	var includeHtmlFolder = options.includeHtmlFolder || false;
	var result = [];
	path = SystemAPI.cleanPath( path );
	var dirSep = PATH.sep;
	var files;
	try
	{
		files = FS.readdirSync( path + dirSep );
	}
	catch( err )
	{
		console.log( err );
		return false;
	}
	if ( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var sPath = path + dirSep + files[ f ];
			try
			{
				if ( !SystemAPI.isDirectory( sPath ) )
				{
					result.push(
					{
						name: files[f],
						path: sPath,
						isDirectory: false
					} );
				}
				else
				{
					if ( options.recursive )
					{
						if ( includeHtmlFolder )
						{
							var newResult = SystemAPI.readDirectory( sPath, options );
							result.push(
							{
								name: files[f],
								path: sPath,
								isDirectory: true,
								files: newResult
							} );
						}
						else
						{
							var test = sPath.toLowerCase().substring( sPath.length - 5, sPath.length ) == dirSep + 'html';

							if ( !test )
							{
								var newResult = SystemAPI.readDirectory( sPath, options );
								result.push(
								{
									name: files[f],
									path: sPath,
									isDirectory: true,
									files: newResult
								} );
							}
						}
					}
					else
					{
						result.push(
						{
							name: files[f],
							path: sPath,
							isDirectory: true
						} );
					}
				}
			}
			catch( err )
			{
				console.log( err );
				return false;
			}
		}
	}
	return result;
};

SystemAPI.deleteDirectory = function( destinationPath, options, tree, count )
{
	try
	{
		var dirSep = PATH.sep;
		var paths =  destinationPath.split( dirSep );
		path = destinationPath.substring( 0, destinationPath.length - ( paths[ paths.length - 1 ].length - 1 ) );
		if( process.platform == 'win32' )
		{
			SystemAPI.execCommand( 'powershell rd \'' + destinationPath + '\' -Recurse -Force', { cwd: path } );

		}
		if( process.platform == 'darwin' )
		{
			SystemAPI.execCommand( 'rm -R \'' + destinationPath + '\'', { cwd: path } );

		}
		if( process.platform == 'linux' )
		{
			SystemAPI.execCommand( 'rm -rf \'' + destinationPath + '\'', { cwd: path } );

		}		
		return true;
	}
	catch( error )
	{
		console.error( error );
		return false;
	}
	return true;
};

SystemAPI.copyDirectory = function( destination, source, options, callback )
{
	var dirSep = PATH.sep;
	try
	{
		// Clean source path
		source = SystemAPI.cleanPath( source );
		destination = SystemAPI.cleanPath( destination );

		// Create destination directory
		if( !FS.existsSync( destination ) )
		{
			MKDIRP.sync( destination );
		}

		// Copy files
		var files = SystemAPI.readDirectory( source, options );
		if ( files )
		{
			for ( var f = 0; f < files.length; f++ )
			{
				var file = files[ f ];
				var subPath = file.path.substring( source.length + 1 );
				var dPath = destination + dirSep + subPath;
				if ( !file.isDirectory )
				{
					FS.copyFileSync( file.path, dPath );
				}
				else if ( options.recursive )
				{
					if( !SystemAPI.copyDirectory( dPath, file.path, options ) )
					{
						return false;
					}
				}
			}
		}
		
		return true;
	}
	catch( err )
	{
		return false;
		console.error( err );
	}
};
	
SystemAPI.copy = function( srcPath, destPath, options, callback, extra )
{
	if ( !callback )
		return FS.copyFileSync( srcPath, destPath, options.mode );
	FS.rename( srcPath, destPath, options.mode, function( err )
	{
		callback( !err, err, extra );
	} );
};
	
SystemAPI.rename = function( oldPath, newPath, options, callback, extra )
{
	if ( !callback )
		return FS.renameSync( oldPath, newPath );
	FS.rename( oldPath, newPath, function( err )
	{
		callback( !err, err, extra );
	} );
};

SystemAPI.getAOZFilename = function( path, tries, fullPath )
{
	if( path == undefined || path == '' )
	{
		return "";
	}

	if( fullPath == undefined )
	{
		fullPath = false;
	}

	if( tries == undefined )
	{
		tries = 1;
	}
	
	if( PATH.extname( path ).toLowerCase() == ".aoz" )
	{
		return path;
	}

	if( FS.existsSync( path ) )
	{
		var tree = SystemAPI.readDirectory( path, { } );
		if( tree )
		{
			for( var t = 0; t < tree.length; t++ )
			{
				var item = tree[ t ];
				if( !item.isDirectory && SystemAPI.getFileExtension( item.name ).toLowerCase() == 'aoz' )
				{
					if( fullPath )
					{
						return path + PATH.sep + item.name;
					}
					else
					{
						return item.name;
					}
				}						
			}
		}
	}
	
	if( tries < 20 )
	{
		return SystemAPI.getAOZFilename( PATH.dirname( path ), tries++, fullPath );
	}
};

SystemAPI.openAOZProject = function( path )
{
	var aozFile = SystemAPI.getAOZFilename( path );
	if( aozFile == "" )
	{
		return false;
	}
	
	var ext = SystemAPI.getFileExtension( aozFile );
	var dirSep = PATH.sep;

	if( ext.toLowerCase() != 'aoz' )
	{
		return false;
	}
	try{
		atom.aozConfig.addProjectFolder( path, true );
		atom.workspace.open( path + dirSep + aozFile);
		return true;
	}
	catch( err )
	{
		console.error( err );
		return false;
	}
};

SystemAPI.execCommand = function( command, options, callback )
{
	var self = this;
	try
	{
		var child = EXEC.exec( command, {}, function ( msg, stdout, stderr )
			{
				if ( callback )
				callback( { stdout: stdout, stderr: stderr } );
			}
		);
		child.stdout.on( 'data', function( pipe )
		{
			console.log ( 'data' );
			console.log( pipe );
		} );
		
		child.stderr.on( 'data', function ( pipe )
		{
			console.log ( 'err' );
			console.log( pipe );
		} );		
	}
	catch ( e )
	{
		console.log( e ); 
		return false;
	}
	return true;
};

SystemAPI.getFileUri = function( str )
{
    var pathName = PATH.resolve(str).replace(/\\/g, '/');
    if ( pathName[ 0 ] !== '/' )
	{
        pathName = '/' + pathName;
    }
    return encodeURI( 'file://' + pathName );
};

SystemAPI.openURLInBrowser = function( url )
{
	let commandLine;
	switch (process.platform) {
		case 'darwin': commandLine = 'open';     break;
		case 'linux':  commandLine = 'xdg-open'; break;
		case 'win32':  commandLine = 'explorer'; break;
	}
	if ( commandLine ) commandLine += ' "' + url + '?forced=' + Date.now() + '"';

	SystemAPI.execCommand( commandLine, AOZConfig.installInformation.aozPath, ( response, data ) =>
	{
		if ( !response || ( data && data.stderr != '' ) )
		{
			REMOTE.dialog.showErrorBox( 'AOZ Studio', atom.aozLang.getTerm( 'dialog:browser-error' ) );
		}
	}, { output: false } );
}

const PATH = require( 'path' );
const FS = require( 'fs' );
const MKDIRP = require( 'mkdirp' );
const REMOTE = require('electron').remote;
const HJSON = require( 'hjson' );
const EXEC = require( 'child_process' );
const JSZIP = require( 'jszip' );
const DecompressZip = require('decompress-zip');
const UTILITIES = require( './transpiler/utilities' );
const TRANSPILER = require( './transpiler/transpiler' );
var dirSep = PATH.sep;

var AOZIO = new Object();

AOZIO.saveJSON = function( obj, path )
{
	var json = JSON.stringify( obj );
	try
	{
		FS.writeFileSync( path, json, { encoding: 'utf8' } );
	}
	catch ( err )
	{
		REMOTE.dialog.showErrorBox( "AOZ Studio", "Cannot save file..." );
	}
};

AOZIO.loadJSON = function( path )
{
	path = AOZIO.cleanPath( path );
	try
	{
		var json = AOZIO.loadIfExist( path, 'utf8' );
		if ( json )
		{
			return JSON.parse( json );
		}
	}
	catch( e )
	{
		console.error( "LoadHJSON Parsing error:", e );
	}
	return undefined;
};

AOZIO.loadHJSON = function( path )
{
	path = AOZIO.cleanPath( path );
	try
	{
		var json = AOZIO.loadIfExist( path, 'utf8' );
		if ( json )
		{
			json = UTILITIES.fixJson( json );
			return HJSON.parse( json );
		}
	}
	catch( e )
	{
		console.error( "LoadHJSON Parsing error:", e );
	}
	return undefined;
};

AOZIO.saveHJSON = function( obj, path )
{
	var json = HJSON.stringify( obj );
	try
	{
		FS.writeFileSync( path, json, { encoding: 'utf8' } );
	}
	catch ( err )
	{
		console.log( err );
		REMOTE.dialog.showErrorBox( "AOZ Studio", "Cannot save user information..." );
	}
};

AOZIO.openFile = function( path, callback )
{
	var ext = AOZIO.getFileExtension( path );
	var dirSep = PATH.sep;

	try
	{
		switch( ext.toLowerCase() )
		{
			case 'aoz':
				atom.aozConfig.addProjectFolder( path, true );
				atom.workspace.open( path );
				if( callback )
				{
					callback( "no" );
				}				
				break;
				
			case 'aozip':
				atom.AOZipUtils.loadPackage( path, function( error, destPath )
				{
					if( callback )
					{
						callback( error, destPath );
					}
				});
				break;
				
			case 'amos':
				atom.AMOSUtils.importAMOS( path, function( error, destPath )
				{
					if( callback )
					{
						callback( error, destPath );
					}					
				} );			
				break
		}
	}
	catch( err )
	{
		console.log( err );
		if( callback )
		{
			callback( err, "" );
		}
	}
};

AOZIO.getProjectAOZFilename = function( path, callback )
{
		if( path == undefined || path == '' )
		{
			if( callback )
			{
				callback( "no_path_defined", "" );
			}
			return null;
		}


		if( FS.existsSync( path ) )
		{
			var tree = AOZIO.getDirectory( path, { } );
			if( tree )
			{
				for( var t = 0; t < tree.length; t++ )
				{
					var item = tree[ t ];
					if( !item.isDirectory && AOZIO.getFileExtension( item.name ) == 'aoz' )
					{
						if( callback )
						{
							callback( "", item.name );
						}
						return item.name;
					}						
				}
			}
		}
		
		if( callback )
		{
			callback( "no_aoz_found", "" );
		}
		return null;
};

AOZIO.extractZip = function( zipFile, path, callback )
{
	var zipPath = path;
	var zipPath = AOZIO.cleanPath( zipPath );
	if( !AOZIO.isDirectory( zipPath ) )
	{	
		AOZIO.createDirectory( zipPath );
	}
	var dirSep = PATH.sep;
	
	try
	{
		var buffer = FS.readFileSync( zipFile );
		var zip = new JSZIP();
		var self = this;

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
					
					if( !AOZIO.isDirectory( path.strReplace( "\\", "/" ) ) )
					{
						AOZIO.createDirectory( path.strReplace( "\\", "/" ) );
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
						var dest = zipPath + dirSep + file.name;
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

AOZIO.saveCurrentAOZ = function( destPath , callback )
{
	destPath = AOZIO.cleanPath( destPath );
	try
	{
		var code = atom.workspace.getActiveTextEditor().getText();
		FS.writeFileSync( destPath, code );
		if( callback )
		{
			callback( "" );
		}
		return true;
	}
	catch( err )
	{
		if( callback )
		{
			callback( "" );
		}
		return true;		
	}
}

AOZIO.zipPath = function( path, zipPath, callback )
{
	var dirSep = PATH.sep;
	path = AOZIO.cleanPath( path );
	zipPath =  AOZIO.cleanPath( zipPath );
	try
	{
		var dejaErr = false;
		var zip = new JSZIP();
		var tree = AOZIO.getDirectory( path, { recursive: true } );
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
}

AOZIO.saveHTML = function( destPath , callback )
{
	var dirSep = PATH.sep;
	destPath = AOZIO.cleanPath( destPath );
	try
	{
	
		if( !FS.existsSync( destPath + dirSep + 'output' ) )
		{
			AOZIO.createDirectory( destPath + dirSep + 'output' );
		}

		if( !FS.existsSync( destPath + dirSep + 'output' + dirSep + 'html5' ) )
		{
			AOZIO.createDirectory( destPath + dirSep + 'output' + dirSep + 'html5' );
		}
		else
		{
			AOZIO.deleteDirectory ( destPath + dirSep + 'output' + dirSep + 'html5' );
			AOZIO.createDirectory( destPath + dirSep + 'output' + dirSep + 'html5' );
		}
		
		atom.aozStudioViewer.buildCurrentApplication( { output: false, runIn: 'none', tags: { displayEndAlert: false }, path: destPath + dirSep + 'output' + dirSep + 'html5' }, function( success, obj2, obj3 )
		{
			if( success )
			{
						
				if( callback )
				{
					callback( "" );
				}
			}
			else
			{
				if( callback )
				{
					callback( "error" );
				}				
			}
		} );
	}
	catch( err )
	{
		console.log( err );
		if( callback )
		{
			callback( err );
		}
		return true;		
	}
}

AOZIO.saveFile = function ( destPath, data, callback )
{
	try
	{
		FS.writeFileSync( destPath, data );
		if( callback )
		{
			callback( "" );
		}
		return true;		
	}
	catch( err )
	{
		console.log( err );
		if( callback )
		{
			callback( err );
		}
		return false;
	}
}

AOZIO.getLocalDrives = function()
{
	var dirSep = PATH.sep;
	var result = [];
	if( process.platform == 'win32' )
	{
		for ( var c = 0; c <= 25; c++ )
		{
			var drive = String.fromCharCode( 65 + c ) + ':';
			if( FS.existsSync( drive ) )
			{
				result.push( { "path": drive.toLowerCase(), "name": "Local Drive " + drive } );
			}	
		}		
	}
	
	if( process.platform == 'darwin' )
	{
		var path = require( 'os' ).homedir();
		if( FS.existsSync( path ) )
		{
			result.push( { "path": path, "name": path } );
		}
	}
	
	if( process.platform == 'linux' )
	{
		if( FS.existsSync( "/dev/sda" ) )
		{
			result.push( { "path": "/dev/sda", "name": "/dev/sda" } );
		}
		
		if( FS.existsSync( "/dev/sdb" ) )
		{
			result.push( { "path": "/dev/sdb", "name": "/dev/sdb" } );
		}	
	}	
	return result;
};

AOZIO.getDirectory = function( path, options )
{
	var includeHtmlFolder = options.includeHtmlFolder || false;
	var result = [];
	path = AOZIO.cleanPath(path);
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
//				var stats = FS.statSync( sPath );
				if ( !AOZIO.isDirectory( sPath ) )
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
							var newResult = AOZIO.getDirectory( sPath, options );
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
								var newResult = AOZIO.getDirectory( sPath, options );
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
						});
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

AOZIO.deleteDirectory = function( destinationPath, options, tree, count )
{
	try
	{

		var elms = document.getElementsByClassName( 'icon' );
		if( elms )
		{
			for( var e = 0; e < elms.length; e++ )
			{
				if( elms[ e ].dataset.path == destinationPath )
				{
					var classList = elms[ e ].parentNode.classList;
					if( classList )
					{
						for( var c = 0; c < classList.length; c++ )
						{
							if( classList == 'project-root' )
							{
								atom.commands.dispatch( elms[ e ].parentNode, 'tree-view:remove-project-folder' );
								break;
							}
						}
					}
					elms[ e ].parentNode.parentNode.removeChild( elms[ e ].parentNode );
				}
			}
		}
		var dirSep = PATH.sep;
		var paths =  destinationPath.split( dirSep );
		path = destinationPath.substring( 0, destinationPath.length - ( paths[ paths.length - 1 ].length - 1 ) );
		if( process.platform == 'win32' )
		{
			AOZIO.execCommand( 'powershell rd \'' + destinationPath + '\' -Recurse -Force', { cwd: path } );

		}
		if( process.platform == 'darwin' )
		{
			AOZIO.execCommand( 'rm -R \'' + destinationPath + '\'', { cwd: path } );

		}
		if( process.platform == 'linux' )
		{
			AOZIO.execCommand( 'rm -rf \'' + destinationPath + '\'', { cwd: path } );

		}		
		return;
	}
	catch( error )
	{
		console.error( error );
		return false;
	}
};

AOZIO.createDirectory = function( path, callback )
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
			AOZIO.execCommand( 'mkdir "' + path + '"', { cwd: path } );
		}
		
		if( process.platform == "darwin" )
		{
			AOZIO.execCommand( 'mkdir \'' + path + '\'', { cwd: path } );
		}
		
		if( process.platform == "linux" )
		{
			AOZIO.execCommand( 'mkdir \'' + path + '\'', { cwd: path } );
		}
		
		if( callback )
		{
			setTimeOut( function()
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

AOZIO.deleteFile = function( path, callback )
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
		console.error( e );
		if( callback )
		{
			callback( "delete_file_error" );
		}		
		return false;
	}
};

AOZIO.loadIfExist = function( path, encoding, callback )
{
	encoding = typeof encoding == 'undefined' ? 'utf8' : encoding;
    if ( FS.existsSync( path ) )
	{
        try
		{
            var data =  FS.readFileSync( path, { encoding: encoding } );
			if( callback )
			{
				callback( "", data );
			}
			return data;			
        }
        catch ( err )
		{
			console.log( err );
			if( callback )
			{
				callback( "load_file_error", "" );
			}
            return null;
        }
    }
	
	if( callback )
	{
		callback( "file_not_exists", "" );
	}
    return null;
};

AOZIO.directoryExists = function( path )
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

AOZIO.copyDirectory = function( destination, source, options, callback )
{
	var dirSep = PATH.sep;
	try
	{
		// Clean source path
		source = AOZIO.cleanPath( source );
		destination = AOZIO.cleanPath( destination );

		// Create destination directory
		if( !FS.existsSync( destination ) )
		{
			MKDIRP.sync( destination );
		}

		// Copy files
		var files = AOZIO.getDirectory( source, options );
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
					AOZIO.copyDirectory( dPath, file.path, options );
				}
			}
		}
		
		if( callback )
		{
			callback( "" );
		}
	}
	catch( err )
	{
		if( callback )
		{
			callback( "error_template_copying" );
		}
		console.error( err );
	}
};

AOZIO.rename = function( oldPath, newPath )
{
	FS.rename( oldPath, newPath, ( err ) => {
		if( err )
		{
			throw err;
		}
	} );
};

AOZIO.cleanPath = function( path )
{
	var pos = 0;
	while( ( pos = path.indexOf( '\\', pos ) ) >= 0 )
		path = path.substring( 0, pos ) + '/' + path.substring( pos + 1 );
	if( path.charAt( path.length - 1 ) == '/' )
		path = path.substring( 0, path.length - 1 );
	return path;
};

AOZIO.isDirectory = function( path )
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

AOZIO.isFile = function( path )
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

AOZIO.getFileExtension = function( path )
{
	if( path )
	{
		var parts = path.split( "." );
		var ext = parts[ parts.length - 1 ];
		return ext.toLowerCase();
	}
	return null;
};

AOZIO.getDirectoryString = function( path )
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
};

AOZIO.getFileUri = function( str )
{
    var pathName = PATH.resolve(str).replace(/\\/g, '/');
    if ( pathName[ 0 ] !== '/' )
	{
        pathName = '/' + pathName;
    }
    return encodeURI( 'file://' + pathName );
};

AOZIO.deleteEmptyFiles = function( tree )
{
	for ( var f in tree )
	{
		var file = tree[ f ];
		if ( !file.isDirectory )
		{
			if ( file.name == "empty.file" )
			{
				FS.unlinkSync( file.path );
			}
		}
		else
		{
			AOZIO.deleteEmptyFiles( file.files );
		}
	}
};

AOZIO.addProjectFolder = function( path )
{
	atom.project.addPath( path );

	var pathsPath = this.getConfigPath() + 'paths.cfg';
	FS.readFile( AOZConfig.installInformation.aozPath + pathsPath, 'utf-8', ( err, data ) =>
	{
		if(err)
		{
			atom.alert( atom.aozLang.getTerm( 'dialog:error-read-file' ) + err.message);
			return;
		}

		data = data + " \"" + path + "\"";

		FS.writeFile( AOZConfig.installInformation.aozPath + pathsPath, data, (err) =>
		{
			if (err) {
				atom.alert( atom.aozLang.getTerm( 'dialog:error-update-file' ) + err.message);
				console.log(err);
				return;
			}
		});
	});
}

AOZIO.openDirectory = function( path )
{
	var json =
	{
		path: path,
		folders: new Array(),
		files: new Array(),
		error: false
	};

	try
	{
		source = AOZIO.cleanPath( path );
		var files = AOZIO.getDirectory( source, {} );
		if ( files )
		{
			for ( var f = 0; f < files.length; f++ )
			{
				var file = files[ f ];
				var subPath = file.path.substring( source.length + 1 );
				if ( !file.isDirectory )
				{
					json.files.push( file );
				}
				else
				{
					json.folders.push( file );
				}
			}
		}
	}
	catch( err )
	{
		console.error( err );
		json.error = true;
	}
	return json;
};

AOZIO.showOpenDialog = function( options, callback )
{
	var path = REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), options );
	if( path )
	{
		if( callback )
		{
			if( path )
			{
				callback( path[ 0 ] );
			}
			else
			{
				callback( undefined );
			}
		}
	}
};

AOZIO.showSaveDialog = function( options, callback )
{
	var path = REMOTE.dialog.showSaveDialogSync( REMOTE.getCurrentWindow(), options );
	if( path )
	{
		if( callback )
		{
			if( path )
			{
				callback( path );
			}
			else
			{
				callback( undefined );
			}
		}
	}
};

AOZIO.execCommand = function( command, options, callback )
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

AOZIO.loadFile = function( path, callback )
{

	var content = AOZIO.loadIfExist( path );
	var response =
	{
		error: false,
		data: ''
	};

	if( content == null )
	{
		response.error = 'file_not_found';
	}
	else
	{
		response.data = new Buffer( content ).toString( 'base64' );
	}

	console.log( response );
	if( callback )
	{
		callback( response );
	}
};

AOZIO.saveFile = function( path, data, encoding,callback )
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

module.exports = AOZIO;

const PATH = require( 'path' );
const FS = require( 'fs' );
const MKDIRP = require( 'mkdirp' );

function readFile( options, cb, bySocket )
{
	try
	{
		var buffer = FS.readFileSync( options.path );
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'onreadfile',
					path: options.path, 
					data: buffer.toString()
				}
			);
		}
		else
		{
			return buffer.toString();
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.readFile = readFile;

function writeFile( options, cb, bySocket )
{
	try
	{
		FS.writeFileSync( options.path, options.data );
		if( bySocket )
		{
			cb( 
			{ 
				event: 'onwritefile',
				error: false
			} );
		}
		else
		{
			return true;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				event: 'onerror',
				message: e.message,
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.writeFile = writeFile;

function removeFile( options, cb, bySocket )
{
	try
	{
		FS.unlinkSync( options.path );
		if( bySocket )
		{
			cb( 
				{ 
					event: 'onremovefile',
					error:false
				}
			);
		}
		else
		{
			return true;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb(
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.removeFile = removeFile;

function renameFile( options, cb, bySocket )
{
	try
	{
		FS.renameSync( options.oldpath, options.newpath );
		if( bySocket )
		{
			cb(
			{ 
				event: 'onrenamefile',
				error: false
			} );
		}
		else
		{
			return true;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 				
			{ 
				event: 'onerror',
				message: e.message,
				error: true
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.renameFile = renameFile;

function copyFile( options, cb, bySocket )
{
	try
	{
		FS.copyFileSync( options.source, options.path );
		if( bySocket )
		{
			cb(
			{ 
				event: 'oncopyfile',
				error: false
			} );
		}
		else
		{
			return true;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb(				
			{ 
				event: 'onerror',
				error: true,
				message: e.message
			});
		}
		else
		{		
			return false;
		}
	}
}
exports.copyFile = copyFile;

function existsFile( options, cb, bySocket )
{
	try
	{
		var result = FS.existsSync( options.path );
		if( bySocket )
		{
			cb( 
				{ 
					error: false,
					event: 'onexistsfile',
					isexists: result
				}
			 );
		}
		else
		{
			return true;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb(				
			{ 
				event: 'onerror',
				message: e.message,
				error: false,
				isexists: false
			});
		}
		else
		{		
			return false;
		}
	}
}
exports.existsFile = existsFile;

function extname( options, cb, bySocket )
{
	try
	{
		var ext = PATH.extname( options.path );
		if( bySocket )
		{
			cb( 				
			{ 
				event: 'onext',
				error: false,
				extname: ext.toLowerCase(),
			} );
		}
		else
		{
			return true;
		}		
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 				
			{ 
				event: 'onerror',
				error: true,
				message: e.message
			} );
		}
		else
		{		
			return false;
		}
	}	
}
exports.extname = extname;

function canRead( options, cb, bySocket )
{
	try
	{
		FS.accessSync( options.path, FS.constants.R_OK );
		if( bySocket )
		{
			cb( 				
			{ 
				event: 'oncanread',
				error:false,
				canRead: true
			} );
		}
		else
		{
			return true;
		}
	}
	catch( err )
	{
		if( bySocket )
		{
			cb( 				
				{ 
					event: 'oncanread',
					error: false,
					canRead: false
				} );
		}
		else
		{
			return false;
		}
	}	
}
exports.canRead = canRead;

function canWrite( options, cb, bySocket )
{
	try
	{
		FS.accessSync( options.path, FS.constants.W_OK );
		if( bySocket )
		{
			cb( 				
				{ 
					event: 'oncanwrite',
					error:false,
					canWrite: true
				} );
		}
		else
		{
			return true;
		}
	}
	catch( err )
	{
		if( bySocket )
		{
			cb( 				
			{ 
				event: 'oncanwrite',
				error:false,
				canWrite: false
			} );
		}
		else
		{
			return false;
		}
	}	
}
exports.canWrite = canWrite;

function getDirectory( options, cb, bySocket )
{
	var includeHtmlFolder = options.includeHtmlFolder || true;
	var result = [];
	path = PATH.normalize( options.path );
	var files;
	try
	{
		files = FS.readdirSync( options.path + '/' );
	}
	catch( err )
	{
		if( bySocket )
		{
			cb( 				
				{ 
					event: 'onerror',
					error: true,
					message: err.message
				} );
		}
		else
		{
			console.log( err );
			return false;
		}		
	}
	
	if ( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var sPath = PATH.normalize( options.path + '/' + files[ f ] );
			try{
				var stats = FS.statSync( sPath );
				if ( !stats.isDirectory() )
				{
					result.push(
					{
						name: files[ f ],
						path: sPath,
						type: 1
					} );
				}
				else
				{
					if ( options.recursive )
					{
						if ( includeHtmlFolder )
						{
							var newResult = atom.editorSDK.filesystem.getDirectory( { path: sPath, recursive: options.recursive } );
							result.push(
							{
								name: files[ f ],
								path: sPath,
								type: 0,
								files: newResult
							} );
						}
						else
						{
							if ( PATH.basename( sPath ).toLowerCase() != path + '/html' )
							{
								var newResult = atom.editorSDK.filesystem.getDirectory( { path: sPath, recursive: options.recursive } );
								result.push(
								{
									name: files[ f ],
									path: sPath,
									type: 0,
									files: newResult
								} );
							}
						}
					}
					else
					{
						result.push(
						{
							name: files[ f ],
							path: sPath,
							type: 0
						} );
					}
				}
			}
			catch( err )
			{
				if( bySocket )
				{
					cb( 
					{
						event: 'onerror',
						message: err.message,
						error: false
					} );
				}
				else
				{
					console.log( err );
					return false;
				}				
			}
		}
	}

	if( bySocket )
	{
		cb( 				
			{ 
				event: 'ongetdir',
				error: false,
				numOfFiles: result.length,
				files: result
			} );
	}
	else
	{
		return result;
	}	
};
exports.getDirectory = getDirectory;

function makeDir( options, cb, bySocket )
{
	var path = PATH.normalize( options.path );
	try
	{
		if( !FS.existsSync( path ) )
		{
			MKDIRP.sync( options.path );
			if( bySocket )
			{
				cb( 				
				{ 
					event: 'onmakedir',
					error: false
				} );
			}
			else
			{
				return true;
			}
		}
		else
		{
			if( bySocket )
			{
				cb( 				
				{ 
					event: 'onerror',
					error: true,
					message: 'Error during the directory making.'
				} );
			}
			else
			{
				return false;
			}
		}
	}
	catch( err )
	{
		if( bySocket )
		{
			cb( 				
			{ 
				event: 'onerror',
				error: true,
				message: err.message
			} );
		}
		else
		{
			return false;
		}
	}
}
exports.makeDir = makeDir;

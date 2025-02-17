const PATH = require( 'path' );
const FS = require( 'fs' );
const SystemAPI = require( '../system-api.js' );
const TRANSPILER = require( '../transpiler/transpiler.js' );

/**
	Open an AOZ project from path and returns true if success, or false
*/
function openAOZProject( options, cb, bySocket )
{
	var aozFile = getAOZFilename( options.path );
	if( aozFile == "" )
	{
		if( bySocket )
		{
			cb( 
				{
					 event: 'onerror',
					 message: 'file_not_defined',
					 error: true
		 		}
			);
			return;
		}
		else
		{
			return false;
		}
	}
	
	var ext = PATH.extname( aozFile );
	if( ext.toLowerCase() != '.aoz' )
	{
		if( bySocket )
		{
			cb( 
				{ 
					event: 'onerror', 
					message: 'aoz_file_not_found', 
					error: true 
				}
			);
			return;
		}
		else
		{
			return false;
		}
	}
	
	try{
		atom.aozConfig.addProjectFolder( options.path, true );
		atom.workspace.open( options.path + PATH.sep + aozFile );
		if( bySocket )
		{
			cb( 
			{
				event: 'onopen', 
				error: false,
				path: options.path.strReplace( "\\","/") + '/' + aozFile
			} );
			return;
		}
		else
		{
			return true;
		}
	}
	catch( err )
	{
		console.error( err );
		if( bySocket )
		{
			cb( 
				{ 
					event: 'onerror', 
					message: err.message, 
					error: true 
				}
			);
			return;
		}		
		else
		{
			return false;
		}
	}
};
exports.openAOZProject = openAOZProject;

/**
	Returns the path of the current AOZ filename associated with the opened tab, or false
*/
function getAOZFilename( options, fullPath )
{
	if( options.path == undefined || options.path == '' )
	{
		if( bySocket )
		{
			cb( 
				{ 
					event: 'onerror', 
					message: 'aoz_path_not_defined', 
					error: true 
				}
			);
			return;
		}		
		else
		{
			return false;
		}
	}

	if( options.fullPath == undefined )
	{
		options.fullPath = false;
	}

	if( options.tries == undefined )
	{
		options.tries = 1;
	}
	
	if( PATH.extname( options.path ).toLowerCase() == ".aoz" )
	{
		if( bySocket )
		{
			cb( 
				{ 
					event: 'onget', 
					path: options.path.strReplace( "\\","/"), 
					error: false 
				}
			);
			return;			
		}
		else
		{		
			return options.path;
		}
	}

	if( FS.existsSync( options.path ) )
	{
		var tree = SystemAPI.readDirectory( options.path, { } );
		if( tree )
		{
			for( var t = 0; t < tree.length; t++ )
			{
				var item = tree[ t ];
				if( !item.isDirectory && PATH.extname( item.name ).toLowerCase() == '.aoz' )
				{
					if( fullPath )
					{
						if( bySocket )
						{
							cb( 
								{ 
									event: 'onget', 
									path:  options.path.strReplace( "\\","/") + '/' + item.name, 
									error: false 
								}
							);
							return;							
						}
						else
						{
							return options.path.strReplace( "\\","/") + '/' + item.name;
						}
					}
					else
					{
						if( bySocket )
						{
							cb( 
								{ 
									event: 'onget', 
									path:  item.name, 
									error: false 
								}
							);
							return;
						}
						else
						{						
							return item.name;
						}
					}
				}						
			}
		}
	}
	
	if( options.tries < 20 )
	{
		return getAOZFilename( options, cb, bySocket );
	}

	if( bySocket )
	{
		cb( 
			{ 
				event: 'onerror', 
				message: 'aoz_file_not_found', 
				error: true 
			}
		);
		return;
	}
	else
	{	
		return false;
	}
};
exports.getAOZFilename = getAOZFilename;

/**
	Returns the path of the current AOZ project associated with the opened tab, or false
*/
function getCurrentProjectFolder( options, cb, bySocket )
{
	var editor = atom.workspace.getActiveTextEditor();
	if( editor && editor.projectPath )
	{
		if( bySocket )
		{
			cb( 
				{ 
					event: 'onget', 
					path:  editor.projectPath.strReplace( "\\","/"), 
					error: false 
				}
			);
			return;			
		}
		else
		{		
			return editor.projectPath.strReplace( "\\","/");
		}
	}	
	if( bySocket )
	{
		cb( 
			{ 
				event: 'onerror', 
				message: 'project_path_not_found', 
				error: true 
			}
		);
		return;
	}
	else
	{	
		return false;
	}
}
exports.getCurrentProjectFolder = getCurrentProjectFolder;

/**
	Returns the path of the AOZ Studio installation
*/
function getAOZFolder( options, cb, bySocket )
{
	if( atom && atom.aozConfig && atom.aozConfig.installInformation && atom.aozConfig.installInformation.commonPath )
	{
		if( bySocket )
		{
			cb( 
				{ 
					event: 'onget', 
					path:  atom.aozConfig.installInformation.commonPath.strReplace( "\\","/"), 
					error: false 
				}
			);
			return;			
		}
		else
		{
			return atom.aozConfig.installInformation.commonPath.strReplace( "\\","/");
		}
	}	

	if( bySocket )
	{
		cb( 
			{ 
				event: 'onerror', 
				message: 'aoz_path_not_found', 
				error: true 
			}
		);
		return;
	}
	else
	{	
		return false;
	}
}
exports.getAOZFolder = getAOZFolder;

/**
	Transpile a command for console
*/
function getTranspiledCommand( options, cb, bySocket )
{
	TRANSPILER.transpileCommand( options.value, options, function( response, data, extra )
	{
		if( bySocket )
		{
			if ( response )
			{
				cb( 
					{ 
						event: 'ongettranspiledcommand', 
						code:  data, 
						error: false 
					}
				);
			}
			else
			{
				cb( 
					{ 
						event: 'ongettranspiledcommand', 
						code:  data, 
						error: true 
					}
				);				
			}
			return;			
		}
		else
		{		
			return false;
		}
	} );
}
exports.getTranspiledCommand = getTranspiledCommand;

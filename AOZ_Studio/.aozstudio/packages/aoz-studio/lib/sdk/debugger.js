const PATH = require( 'path' );
const FS = require( 'fs' );
const UTILITIES = require( '../transpiler/utilities' );

function setAozViewerTitle( options, cb, bySocket )
{
	if ( atom.aozViewer.win )
		atom.aozViewer.win.setTitle( options.title );
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'setAozViewerTitle'
		} );										
	}
	else
	{
		cb( false );
	}	
}
exports.setAozViewerTitle = setAozViewerTitle;

function saveUserConfig( options, cb, bySocket )
{
	AOZConfig.aoz_settings[ options.identifier ] = options.data;
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'saveUserConfig'
		} );										
	}
	else
	{
		cb( false );
	}	
}
exports.saveUserConfig = saveUserConfig;

function callAtomApi( options, cb, bySocket )
{	
	if ( atom.aozAPI[ options.command ] )
	{
		var result = atom.aozAPI[ options.command ]( options );
		if( bySocket )
		{
			cb(	{
				error: false,
				event: 'callAtomApi',
				command: options.command,
				extra: options.extra,
				result: result
			} );										
		}
		else
		{
			cb( data );
		}	
	}
	else
	{
		if( bySocket )
		{
			cb(	{
				error: true,
				event: 'loadUserConfig',
				data: 'API function not found'
			} );										
		}
		else
		{
			cb( 'API function not found' );
		}	
	}
}
exports.callAtomApi = callAtomApi;

function callAtomDos( options, cb, bySocket )
{	
	if ( atom.fileSystem[ options.command ] )
	{
		var result = atom.fileSystem[ options.command ]( options );
		if( bySocket )
		{
			cb(	{
				error: false,
				event: 'callAtomApi',
				command: options.command,
				extra: options.extra,
				result: result
			} );										
		}
		else
		{
			cb( data );
		}	
	}
	else
	{
		if( bySocket )
		{
			cb(	{
				error: true,
				event: 'loadUserConfig',
				data: 'API function not found'
			} );										
		}
		else
		{
			cb( 'API function not found' );
		}	
	}
}
exports.callAtomDos = callAtomDos;

function loadUserConfig( options, cb, bySocket )
{	
	var data = AOZConfig.aoz_settings[ options.identifier ];
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'loadUserConfig',
			data: data
		} );										
	}
	else
	{
		cb( data );
	}	
}
exports.loadUserConfig = loadUserConfig;

function openDevTools( options, cb, bySocket )
{
    if( atom && atom.aozViewer && atom.aozViewer.win && atom.aozViewer.win.webContents )
    {
    	atom.aozViewer.toggleDevTools();
    }

	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'ondevTools'
		} );										
	}
	else
	{
		cb( false );
	}	
}
exports.openDevTools = openDevTools;

function toggleFullscreen(options, cb, bySocket)
{
    if( atom && atom.aozViewer && atom.aozViewer.win && atom.aozViewer.win.webContents )
    {
        atom.aozViewer.win.fullScreen = !atom.aozViewer.win.fullScreen;			
    }
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'onfullScreen'
		} );										
	}
	else
	{
		cb( false );
	}    
}
exports.toggleFullscreen = toggleFullscreen;

function reload(options, cb, bySocket)
{
    if( atom && atom.aozViewer && atom.aozViewer.win && atom.aozViewer.win.webContents )
    {
        atom.aozViewer.win.reload();		
    }
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'onreload'
		} );										
	}
	else
	{
		cb( false );
	}    
}
exports.reload = reload;

function close(options, cb, bySocket)
{
    if( atom && atom.aozViewer && atom.aozViewer.win && atom.aozViewer.win.webContents )
    {
        atom.aozViewer.win.close();		
    }
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'onclose'
		} );										
	}
	else
	{
		cb( false );
	}    
}
exports.close = close;

var tempData;
function storeTempData( options, cb, bySocket )
{
	tempData = options.data;
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'onStoreTempData'
		} );										
	}
	else
	{
		cb( false );
	}    
}
exports.storeTempData = storeTempData;

function getTempData( options, cb, bySocket )
{
	if( bySocket )
	{
		cb(	{
			error: false,
			event: 'onGetTempData',
			data: tempData
		} );										
	}
	else
	{
		cb( false );
	}    
	tempData = undefined;
}
exports.getTempData = getTempData;

function saveCollisionMask( options, cb, bySocket )
{
	var error = true;
	var editor = atom.workspace.getActiveTextEditor();
	if( editor && editor.projectPath )
	{
		var info = { masks: {}, palette: [] };
		var path = PATH.resolve( PATH.dirname( editor.projectPath ), PATH.dirname( options.path ) );
		if ( FS.existsSync( path ) )
		{
			path += PATH.sep + 'info.json';
			var file = UTILITIES.loadIfExist( path, { encoding: 'utf8' } );
			if ( file )
				info = JSON.parse( file );
			var newMask = JSON.parse( options.mask );
			info.masks[ options.path ] = newMask;
			info = JSON.stringify( info );
			try
			{
				FS.writeFileSync( path, info, { encoding: 'utf8' } );
				error = false;
			}
			catch( e )
			{
			}		
		}
		if( bySocket )
		{
			cb(	{
				error: error,
				event: 'onSaveCollisionMask'
			} );										
		}
		else
		{
			cb( false );
		}    
	}
}
exports.saveCollisionMask = saveCollisionMask;


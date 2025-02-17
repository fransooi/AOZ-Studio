const PATH = require( 'path' );
const FS = require( 'fs' );

/**
	Loads and returns an array for the '1.images' folder of the AOZ project given by "path", or false if no images found.
	Each items is a json model with :
		name: name of the image
		image: the canvas of the image
*/
function loadImagesBank( options, cb, bySocket )
{
	var path = options.path;
	var loaded = 0;
	var results = [];
	var files;
	try
	{
		files = FS.readdirSync( PATH.join( path, 'resources', '1.images' ) );
	}
	catch( err )
	{
		if( bySocket )
		{
			cb(	{
				error: true,
				event: 'onerror',
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
			var sPath = PATH.join( path, 'resources', '1.images', files[ f ] );
			try
			{
				if ( !FS.statSync( sPath ).isDirectory() )
				{
					switch( PATH.extname( sPath ).toLowerCase() )
					{
						case '.png':
						case '.jpg':
						case '.jpeg':
						case '.gif':
						case '.bmp':
						case '.iff':
						case '.ilbm':
						case '.svg':
							loaded++;
							results.push(
							{
								name: files[ f ],
								path: sPath
							} );
							break;
					}
				}
			}
			catch( err )
			{
				if( bySocket )
				{
					cb(	{
						error: true,
						event: 'onerror',
						message: err.message
					} );					
				}
				else
				{
					console.log( err );
					cb( true, undefined, 0 );
					return false;
				}
			}
		}
	}
	
	if( cb )
	{
		if( bySocket )
		{
			cb(	{
				error: false,
				event: 'onload',
				files: results,
				loaded: loaded
			} );										
		}
		else
		{
			cb( false, files, loaded, results );
		}	
	}	
	return results;
}
exports.loadImagesBank = loadImagesBank;
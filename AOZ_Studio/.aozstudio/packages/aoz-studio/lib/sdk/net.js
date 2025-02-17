const PATH = require( 'path' );
const FS = require( 'fs' );
const http = require('http');
const request = require( 'request' );

function downloadURL( options, cb, bySocket )
{
	var file_url = options.url; 
	var purcent = 0;	
	var received_bytes = 0;
	var total_bytes = 0;
		
	var req = request(
	{
		method: 'GET',
		uri: file_url
	} );

	try
	{
		var out = FS.createWriteStream( options.path );
		req.pipe( out );

		req.on( 'response', function ( data ) {
			total_bytes = parseInt( data.headers[ 'content-length' ] );
			if( cb )
			{
				if( bySocket )
				{
					cb(
					{
						error: false,
						event: 'onconnect',
						purcent: 0,
						isOver: false
					} );
				}
				else
				{
					cb( 'onconnect', 0, false, false );
				}
			}		
		} );

		req.on( 'data', function( chunk ) {
			received_bytes += chunk.length;
			purcent = ( 100 / total_bytes ) * received_bytes;
			if( cb )
			{
				if( bySocket )
				{
					cb( 
					{ 
						error: false,
						event: 'onprogress', 
						purcent: purcent, 
						isOver: false 
					} );
				}
				else
				{
					cb( 'onprogress', self.purcent, false, false );
				}				
			}			
		} );

		req.on( 'end', function() {
			setTimeout( function()
			{
				purcent = 0;
				if( cb )
				{
					if( bySocket )
					{
						cb(
						{ 
							error: false,
							event: 'onend', 
							purcent: 100,
							isOver: true
						} );
					}
					else
					{
						cb( 'onend', 100, false, true );
					}					
				}
			}, 1000 );
		} );
	}
	catch( err )
	{
		if( cb )
		{
			if( bySocket )
			{
				cb(
				{
					error: true,
					message: err.message,
					event: 'onerror',
					purcent: 0,
					isOver: false
				} );
			}
			else
			{
				cb( 'onerror', 100, true, false );
			}
		}
	}		
}

exports.downloadURL = downloadURL;
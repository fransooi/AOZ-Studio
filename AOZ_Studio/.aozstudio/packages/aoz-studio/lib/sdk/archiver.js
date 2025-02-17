const PATH = require( 'path' );
const FS = require( 'fs' );
const INLY = require( 'inly' );
const TARGZ = require( 'targz' );

function extractGZip( options, cb, bySocket )
{
	var pc = 0;
	var source = options.source;
	var path = options.path;
	
	if( FS.existsSync( source ) )
	{
		var target = path
		var untar = INLY( source, target );
		untar.on( 'file', ( name ) => {
			if( cb )
			{
				if( bySocket )
				{
					cb(	{
						error: false,
						event: 'onfile',
						purcent: pc,
						filename: name,
						isOver: false
					} );					
				}
				else
				{				
					cb( 'onfile', pc, name, false, false );
				}
			}
		} );

		untar.on( 'progress', ( purcent ) => {
			pc = purcent;
			if( cb )
			{
				if( bySocket )
				{
					cb(	{
						error: false,
						event: 'onprogress',
						purcent: pc,
						filename: '',
						error: false,
						isOver: false
					} );					
				}
				else
				{				
					cb( 'onprogress', pc, '', false, false );
				}
			}					
		} );

		untar.on( 'error', ( error ) => {
			if( cb )
			{
				if( bySocket )
				{
					if( bySocket )
					{
						cb(	{
							error: true,
							message: error.message,
							event: 'onerror',
							filename: '',
							isover: true
						} );					
					}
				}
				else
				{				
					cb( 'onerror', pc, '', true, true );
				}
			}
		} );
		
		untar.on( 'end', () => {
			if( cb )
			{
				if( bySocket )
				{
					if( bySocket )
					{
						cb(	{
							error: false,
							event: 'onend',
							purcent: pc,
							filename: '',
							error: false,
							isover: true
						} );					
					}
				}
				else
				{				
					cb( 'onend', pc, '', true, false );
				}
			}
		} );
	}
}
exports.extractGZip = extractGZip;
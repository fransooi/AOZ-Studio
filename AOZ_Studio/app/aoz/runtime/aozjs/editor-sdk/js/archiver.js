application.editorSDK.archiver =
{
    extractGZip: function( source, path, procName )
    {
        application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'archiver', 'extractGZip', { source: source, path: path }, function( response )
        {
			if( response != undefined )
			{
	            if( response.error )
	            {
					if( procName != undefined && procName.trim() != '' )
			        {
	                    application.aoz.runProcedure( procName, { EVENT$: response.event, MESSAGE$: response.message } );
	                }
	                application.editorSDK.busy( false );
	                return;
	            }

	            if( procName && procName != '' )
	            {
	                application.aoz.runProcedure( procName, { EVENT$: response.event, PURCENT: Math.round( response.purcent ), FILENAME$: response.filename, ISERROR: response.error, ISOVER: response.isOver } );
	            }

	            if( response.isOver )
	            {
	                application.editorSDK.busy( false );
	            }
			}
        	return;
        } );
    }
}

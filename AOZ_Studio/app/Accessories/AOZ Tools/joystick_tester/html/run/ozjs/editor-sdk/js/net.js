application.editorSDK.net =
{
    downloadURL: function( url, path, procName )
    {
        application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'net', 'downloadURL', { url: url, path: path }, function( response )
        {
			if( response )
			{
	            if( response.error )
	            {
					if( procName != undefined && procName.trim() != '' )
			        {
	                    application.aoz.runProcedure( procName, { EVENT$: 'onerror', MESSAGE$: response.message } );
					}
	                application.editorSDK.busy( false );
	                return;
	            }

				if( procName != undefined && procName.trim() != '' )
		        {
	            	application.aoz.runProcedure( procName, { EVENT$: response.event, PURCENT: Math.round( response.purcent ), ISOVER: response.isOver } );
				}

				if( response.event == 'onend' )
	            {
	                application.editorSDK.busy( false );
	            }
	            return;
			}
        } );
    }
}

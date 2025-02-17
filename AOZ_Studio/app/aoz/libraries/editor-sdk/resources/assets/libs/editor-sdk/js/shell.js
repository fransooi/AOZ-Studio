application.editorSDK.shell =
{
    shellExecute: function( cmd, procName )
    {
		application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'shell', 'shellExecute', { cmd: cmd }, function( response )
        {
			if( response )
			{
				if( response.error )
	            {
					if( procName && procName != '' )
					{
						application.aoz.runProcedure( procName, { EVENT$: 'onerror', MESSAGE$: response.message } );
					}
	                application.editorSDK.busy( false );
	                return;
	            }

				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'onexecute', MESSAGE$: response.message } );
				}
				application.editorSDK.busy( false );
			}
        } );
    }
};

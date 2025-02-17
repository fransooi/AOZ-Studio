application.editorSDK.project = 
{
    openAOZProject: function( path, procName )
    {
		application.root.vars.AOZ_PROJECT_PATH$ = "";
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'project', 'openAOZProject', { path: path }, function( response )
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

				application.root.vars.AOZ_PROJECT_PATH$	= response.path;
				if( procName && procName != '' )
        		{
					application.aoz.runProcedure( procName, { EVENT$: 'onopen', PATH$: response.path } );
        		}
				application.editorSDK.busy( false );
			}
		} );
    },

    getAOZFilename: function( path, procName )
    {
        application.root.vars.AOZ_FILENAME$ = "";
        application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'project', 'getAOZFilename', { path: path }, function( response )
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

				application.root.vars.AOZ_FILENAME$	= response.path;
				if( procName && procName != '' )
        		{
					application.aoz.runProcedure( procName, { EVENT$: 'onget', PATH$: response.path } );
				}
            	application.editorSDK.busy( false );
        	}
		} );
    },

    getCurrentProjectFolder: function( procName )
    {
        application.root.vars.AOZ_PROJECT_PATH$ = "";
        application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'project', 'getCurrentProjectFolder', {}, function( response )
        {
			console.log( response );
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

				application.root.vars.AOZ_PROJECT_PATH$	= response.path;
				if( procName && procName != '' )
		        {
					application.aoz.runProcedure( procName, { EVENT$: 'onget', PATH$: response.path } );
				}
            	application.editorSDK.busy( false );
        	}
		} );
    }
}

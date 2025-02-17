application.editorSDK.filesystem =
{
    readFile: function( fileName, procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'filesystem', 'readFile', { path: fileName }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onreadfile', FILENAME$: response.path, FILEDATA$: response.data } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    writeFile: function( fileName, data, procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'filesystem', 'writeFile', { path: fileName, data: data }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onwritefile' } );
				}
				application.editorSDK.busy( false );
				application.editorSDK.busy( false );
			}
		} );
    },

    removeFile: function( fileName, procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'filesystem', 'removeFile', { path: fileName }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onremovefile' } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    renameFile: function( path, newName, procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'filesystem', 'onrenameFile', { oldpath: path, newpath: newName }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onrenamefile' } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    copyFile: function( source, path, procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'filesystem', 'copyFile', { source: source, path: path }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'oncopyfile' } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    existsFile: function( fileName, procName )
    {
		application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'filesystem', 'existsFile', { path: fileName }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onexistsfile', VALUE: response.isexists } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    extname: function( fileName, procName )
    {
		application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'filesystem', 'extname', { path: fileName }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onextname', EXTNAME$: response.extname } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    canRead: function( fileName, procName )
    {
		application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'filesystem', 'canRead', { path: fileName }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'oncanread', VALUE: response.canRead } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    canWrite: function( fileName, procName )
    {
		application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'filesystem', 'canWrite', { path: fileName }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'oncanwrite', VALUE: response.canWrite } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

	getDirectory( path, procName )
	{
		application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'filesystem', 'getDirectory', { path: path }, function( response )
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

				if ( response.files )
				{
					var size = 0;
					if( response.files.length == 0 )
					{
						size = 1
					}
					else
					{
						size = response.files.length;
					}

					application.root.vars.FS_NAME$_array.dimensions[ 0 ] = size;
					application.root.vars.FS_NAME$_array.array = [];
					application.root.vars.FS_PATH$_array.dimensions[ 0 ] = size;
					application.root.vars.FS_PATH$_array.array = [];
					application.root.vars.FS_TYPE_array.dimensions[ 0 ] = size;
					application.root.vars.FS_TYPE_array.array = [];
					for( var r = 0; r < response.files.length; r++ )
					{
						application.root.vars.FS_NAME$_array.array.push( response.files[ r ].name );
						application.root.vars.FS_PATH$_array.array.push( response.files[ r ].path );
						application.root.vars.FS_TYPE_array.array.push( response.files[ r ].type );
					}
					if( procName && procName != '' )
					{
						application.aoz.runProcedure( procName, { EVENT$: 'ongetdir', NUM_FILES: response.files.length } );
					}
				}
				application.editorSDK.busy( false );
			}
		} );
	},

	makeDir: function( path, procName )
	{
		application.editorSDK.busy( true );
		application.editorSDK.callRequest( 'filesystem', 'makeDir', { path: path }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onmakedir', PATH$: path } );
				}
				application.editorSDK.busy( false );
			}
		} );
	}
};

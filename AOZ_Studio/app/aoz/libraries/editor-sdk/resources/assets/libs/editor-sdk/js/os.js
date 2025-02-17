application.editorSDK.os =
{
    getPlatform: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getPlatform', {}, function( response )
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

				application.root.vars.OS_NAME$ = response.name;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongetplatform', NAME$: response.name } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getVersion: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getVersion', {}, function( response )
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

				application.root.vars.OS_VERSION$ = response.version;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongetversion', VERSION$: response.version } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getType: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getType', {}, function( response )
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

				application.root.vars.OS_TYPE$ = response.type;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongettype', TYPE$: response.type } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getRelease: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getRelease', {}, function( response )
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

				application.root.vars.OS_RELEASE$ = response.release;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongetrelease', RELEASE$: response.release } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getArch: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getArch', {}, function( response )
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

				application.root.vars.OS_ARCH$ = response.arch;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongetarch', ARCH$: response.arch } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getTotalMemory: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getTotalMemory', {}, function( response )
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

				application.root.vars.OS_TOTALMEM = response.totalmem;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongettotalmemory', TOTALMEM: response.totalmem } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getFreeMemory: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getFreeMemory', {}, function( response )
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

				application.root.vars.OS_FREEMEM = response.freemem;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongetfreememory', FREEMEM: response.freemem } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },
    getHomeDir: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getHomeDir', {}, function( response )
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

				application.root.vars.OS_HOMEDIR$ = response.homeDir;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongethomedir', HOMEDIR$: response.homeDir } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getTempDir: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getTempDir', {}, function( response )
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

				application.root.vars.OS_TEMPDIR$ = response.tempDir;
				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongettempdir', VERSION$: response.tempDir } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },

    getCPU: function( procName )
    {
		application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'os', 'getCPU', {}, function( response )
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

				application.root.vars.OS_CPUMODEL$ = response.model;
				application.root.vars.OS_CPUSPEED = response.speed;

				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'ongetcpu', CPUMODEL$: response.model, CPUSPEED: response.speed } );
				}
				application.editorSDK.busy( false );
			}
		} );
    },									
}
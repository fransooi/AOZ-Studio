application.editorSDK.dialogs =
{
    dlgFilenames: [],
    openFileDialog: function( procName )
    {
        var options = application.editorSDK.dialogs.getDialogOptions();
        options.properties.push( 'openFile' );

		application.editorSDK.dialogs.dlgFilenames = [];
        application.editorSDK.busy( true );

        application.editorSDK.callRequest( 'dialogs', 'openFileDialog', { options: options }, function( response )
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

				if( procname && procname != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'onselect', NUM_FILES: ( response.files ) ? response.files.length : 0, FILENAME$: response.files[ 0 ] } );
				}

	            if( response.files && response.files.length > 0 )
	            {
					application.editorSDK.dialogs.dlgFilenames = response.files;
	            }
				application.editorSDK.busy( false );
			}
        } );
    },

    saveFileDialog: function( procName )
    {
        var options = application.editorSDK.dialogs.getDialogOptions();
        options.properties.push( 'saveFile' );
		application.editorSDK.dialogs.dlgFilenames = [];
        application.editorSDK.busy( true );

        application.editorSDK.callRequest( 'dialogs', 'saveFileDialog', { options: options }, function( response )
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
					application.aoz.runProcedure( procName, { EVENT$: 'onselect', FILENAME$: response.files } );
				}
				application.editorSDK.busy( false );
			}
        } );
    },

    openDirectoryDialog: function( procName )
    {
        var options = application.editorSDK.dialogs.getDialogOptions();
        options.properties.push( 'openDirectory' );

		application.root.vars.DLG_SELECT_COUNT = 0
		application.root.vars.DLG_ERROR = false
        application.root.vars.DLG_FILENAME$ = "";
		application.editorSDK.dialogs.dlgFilenames = [];

        application.editorSDK.busy( true );
        application.editorSDK.callRequest( 'dialogs', 'openDirectoryDialog', { options: options }, function( response )
        {
			if( response )
			{
	            if( response.error )
	            {
					if( procname && procname != '' )
					{
						application.aoz.runProcedure( procName, { EVENT$: 'onerror', MESSAGE$: response.message } );
					}
	                application.editorSDK.busy( false );
	                return;
	            }

				if( procName && procName != '' )
				{
					application.aoz.runProcedure( procName, { EVENT$: 'onselect', NUM_FILES: ( response.files ) ? response.files.length : 0, FILENAME$: response.files[ 0 ] } );
				}

	            if( response.files && response.files.length > 0 )
	            {
					application.editorSDK.dialogs.dlgFilenames = response.files;
	            }
				application.editorSDK.busy( false );
			}
        } );
    },

    getSelectedFilename: function( index )
    {
		application.root.vars.DLG_FILENAME$ = "";
        application.editorSDK.busy( true );
        if( index < 0 || index > ( application.editorSDK.dialogs.dlgFilenames.length - 1 ) )
        {
            application.editorSDK.busy( false );
            return
        }
        application.root.vars.DLG_FILENAME$ = application.editorSDK.dialogs.dlgFilenames[ index ];
        application.editorSDK.busy( false );
    },

    getDialogOptions: function()
    {
        var filters = [];

        if( application.root.vars.DLG_FILTER$ != '' )
        {
            var types = application.root.vars.DLG_FILTER$.split( ';' );
            if( types )
            {
                for( var t = 0; t < types.length; t++ )
                {
					var tp = types[ t ];
                    var part = tp.split( ':' );
                    if( part && part.length == 2 )
                    {
                        var filter = {
                            name: part[ 0 ],
                            extensions: part[ 1 ].split( ',' )
                        }

                        filters.push( filter );
                    }
                }
            }
        }

        var properties = [];
        if( application.root.vars.DLG_MULTISELECTION ) properties.push( 'multiSelections' );
        if( application.root.vars.DLG_SHOW_HIDDEN_FILES ) properties.push( 'showHiddenFiles' );
        if( application.root.vars.DLG_CREATE_DIRECTORY ) properties.push( 'createDirectory' );
        if( application.root.vars.DLG_PROMPT_CREATE ) properties.push( 'promptToCreate' );

        return {
            title: ( application.root.vars.DLG_TITLE$ != '' ) ? application.root.vars.DLG_TITLE$ : '',
            message: ( application.root.vars.DLG_MESSAGE$ != '' ) ? application.root.vars.DLG_MESSAGE$ : '',
            defaulPath: ( application.root.vars.DLG_DEFAULT_PATH$ != '' ) ? application.root.vars.DLG_DEFAULT_PATH$ : '',
            buttonLabel: ( application.root.vars.DLG_BUTTON_LABEL$ != '' ) ? application.root.vars.DLG_BUTTON_LABEL$ : '',
            filters: filters,
            properties: properties
        };
    }
}

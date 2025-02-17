application.editorSDK.dialogs = 
{
    dlgFilenames: [],
    openFileDialog: function()
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }
        var options = getDialogOptions();
        options.properties.push( 'openFile' );

        application.root.vars.DLG_SELECT_COUNT = 0
        application.root.vars.DLG_FILENAME$ = "";
        application.root.vars.DLG_ERROR = False
        application.editorSDK.busy( true ); 
        application.editorSDK.dialogs.dlgFilenames = window.parent.atom.editorSDK.dialogs.openFileDialog( options );       
        if( application.editorSDK.dialogs.dlgFilenames )
        {
            application.root.vars.DLG_SELECT_COUNT = application.editorSDK.dialogs.dlgFilenames.length;        
            application.root.vars.DLG_FILENAME$ =  application.editorSDK.dialogs.dlgFilenames[ 0 ];       
        }
        application.editorSDK.busy( false ); 
    },
    
    saveFileDialog: function()
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }
        var options = getDialogOptions();
        options.properties.push( 'saveFile' );

        application.root.vars.DLG_ERROR = False
        application.editorSDK.busy( true ); 
        application.editorSDK.dialogs.dlgFilenames = window.parent.atom.editorSDK.dialogs.saveFileDialog( options );       
        if( application.editorSDK.dialogs.dlgFilenames )
        {
            application.root.vars.DLG_SELECT_COUNT = 1;        
            application.root.vars.DLG_FILENAME$ =  application.editorSDK.dialogs.dlgFilenames;       
        }
        application.editorSDK.busy( false );                 
    },

    openDirectoryDialog: function()
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }
        var options = getDialogOptions();
        options.properties.push( 'openDirectory' );

        application.root.vars.DLG_SELECT_COUNT = 0
        application.root.vars.DLG_FILENAME$ = "";
        application.root.vars.DLG_ERROR = False
        application.editorSDK.busy( true ); 
        application.editorSDK.dialogs.dlgFilenames = window.parent.atom.editorSDK.dialogs.openDirectoryDialog( options );       
        if( application.editorSDK.dialogs.dlgFilenames )
        {
            application.root.vars.DLG_SELECT_COUNT = application.editorSDK.dialogs.dlgFilenames.length;        
            application.root.vars.DLG_FILENAME$ =  application.editorSDK.dialogs.dlgFilenames[ 0 ];       
        }
        application.editorSDK.busy( false );                
    },
    
    getSelectedFilename: function( index )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.root.vars.DLG_ERROR = false;
        application.root.vars.DLG_FILENAME$ = '';        
        application.editorSDK.busy( true );
        if( index < 0 || index > application.root.vars.DLG_SELECT_COUNT )
        {
            application.root.vars.DLG_ERROR = true
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
            var types = application.root.vars.DLG_FILTER$.split( '|' );
            if( types )
            {
                for( var tp in types )
                {
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
        if( application.root.vars.DLG_MULTISELECTION ) properties.push( 'multiSelection' );
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
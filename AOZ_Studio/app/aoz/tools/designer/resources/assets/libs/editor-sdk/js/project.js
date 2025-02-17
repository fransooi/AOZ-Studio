application.editorSDK.project = 
{
    openAOZProject: function( path )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.editorSDK.busy( true );
        var result = window.parent.atom.editorSDK.project.openAOZProject( path );
        application.editorSDK.busy( false );
    },

    getAOZFilename: function( path )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.AOZ_FILENAME$ = "";
        application.editorSDK.busy( true );

        var result = window.parent.atom.editorSDK.project.getAOZFilename( path );
        if( result )
        {
            application.root.vars.AOZ_FILENAME$ = result;
            application.editorSDK.busy( false );
        }
    },

    getCurrentProjectFolder: function()
    {
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.AOZ_PROJECT_PATH$ = "";
        application.editorSDK.busy( true );

        var result = window.parent.atom.editorSDK.project.getCurrentProjectFolder( path );
        if( result )
        {
            application.root.vars.AOZ_PROJECT_PATH$ = result;
            application.editorSDK.busy( false );
        }
    }
}
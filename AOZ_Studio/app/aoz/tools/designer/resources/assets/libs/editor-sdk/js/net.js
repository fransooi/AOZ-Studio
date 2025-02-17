application.editorSDK.net = 
{
    downloadURL: function( url, path, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        
        var callback = function( eventName, purcent, err, isOver ){};

        if( procName != undefined && procName.trim() != '' )
        {
            callback = function( eventName, purcent, isOver )
            {
                if( err )
                {
                    application.aoz.runProcedure( procName, { EVENT$: eventName, PURCENT: purcent,ISERROR: true, ISOVER: false } );
                    application.editorSDK.busy( false );
                    return;
                }
                application.aoz.runProcedure( procName, { EVENT$: eventName, PURCENT: purcent, ISERROR: false, ISOVER: isOver } );
                if( eventName == 'onend' )
                {
                    application.editorSDK.busy( false );
                }
                return;            
            }
        }

        application.editorSDK.busy( true );        
        window.parent.atom.editorSDK.net.downloadURL( url, path, callback );    
    }
}
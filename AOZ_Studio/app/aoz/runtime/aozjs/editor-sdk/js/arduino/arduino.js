application.editorSDK.arduino = 
{
    initBoard: function( port, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.initBoard( function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );
        }, port );        
    },

    pinMode: function( pin, mode, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.pinMode( pin, mode, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );
        } );         
    },

    analogWrite: function( pin, value, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.analogWrite( pin, value, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );         
    },    

    analogRead: function( pin, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );        
        window.parent.atom.editorSDK.arduino.analogRead( pin, function( eventName, voltage, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, VOLTAGE: voltage, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );         
    },

    digitalWrite: function( pin, value, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.digitalWrite( pin, value, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );
        } );         
    },    

    digitalRead: function( pin, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.digitalRead( pin, function( eventName, voltage, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, VOLTAGE: voltage, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );
        } );         
    },
    
    servoWrite: function( pin, angle, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.servoWrite( pin, angle, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );         
    },

    wait: function( milliseconds, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.wait( milliseconds, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );         
    },

    loop: function( milliseconds, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.loop( milliseconds, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );         
    }        
}
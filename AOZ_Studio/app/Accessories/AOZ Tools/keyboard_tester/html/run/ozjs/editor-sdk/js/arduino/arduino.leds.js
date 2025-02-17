application.editorSDK.arduino.leds = 
{
    initLed: function( procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.initLed( function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledON: function( procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledON( function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledOFF: function( procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledOFF( function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledToggle: function( procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledToggle( function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledBlink: function( milliseconds, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledBlink( milliseconds, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    }, 

    ledStrobe: function( milliseconds, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledStrobe( milliseconds, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledPulse: function( milliseconds, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledPulse( milliseconds, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledStop: function( procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledStop( function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    initLedRGB: function( procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.initLedRGB( function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledFadeOut: function( milliseconds, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledFadeOut( milliseconds, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledFadeIn: function( milliseconds, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledFadeIn( milliseconds, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledBrightness: function( value, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledBrightness( value, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledColor: function( color, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledColor( color, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    },

    ledIntensity: function( color, procName )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw( 'This AOZ program should be executed in the editor only.' );
        }

        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.arduino.ledIntensity( color, function( eventName, error, message )
        {
            if( procName )
            {
                application.runProcedure( procName, { EVENT$: eventName, ISERROR: error, MESSAGE$: message} )
            }
            application.editorSDK.busy( false );            
        } );        
    }                       
}
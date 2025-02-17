const { Led, } = require( 'johnny-five' );
//
// LEDS
//
atom._aoz_led = undefined;
function initLed( options, cb, bySocket )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led = new Led( options.pin );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'oninitled'
                    } );					
                }
                else
                {				
                    cb( 'oninitled', '', false );
                }
            } 
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'oninitledfo',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'oninitled', e.message, true );
                }
            }         
        }
    }
    else
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onboarderror',
                    message: 'Board not connected.'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'Board not connected.', true );
            }
        }    
    }    
}
exports.initLed = initLed;

function ledON( callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }       
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.on();
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '.', false );
                }
            }            
        }
        catch( e )
        {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: e.message
                } );					
            }
            else
            {				
                cb( 'onlederror', e.message, true );
            }
        }        
        }
    }
}
exports.ledON = ledON;

function ledOFF( callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }       
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.off();
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }           
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }        
        }
    }
}
exports.ledOFF = ledOFF;

function ledToggle( milliseconds, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }       
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.toggle( milliseconds );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }              
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }          
        }
    }
}
exports.ledToggle = ledToggle;

function ledBlink( milliseconds, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }         
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.blink( milliseconds );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }             
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }         
        }
    }
}
exports.ledBlink = ledBlink;

function ledStrobe( milliseconds, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }         
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.strobe( milliseconds );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }             
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }        
        }
    }
}
exports.ledStrobe = ledStrobe;

function ledPulse( milliseconds, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }        
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.pulse( milliseconds );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }            
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }         
        }
    }
}
exports.ledPulse = ledPulse;

function ledStop( callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }        
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.stop();
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }            
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }         
        }
    }
}
exports.ledStop = ledStop;

//
// LEDS RGB
//
function initLedRGB( callback )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led = new Led.RGB( [ 9, 10, 11 ] );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'oninitled',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'oninitled', e.message, true );
                }
            }        
        }
    }
    else
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: e.message
                } );					
            }
            else
            {				
                cb( 'onlederror', e.message, true );
            }
        }     
    }
}
exports.initLedRGB = initLedRGB;

function ledFadeOut( milliseconds, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }        
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.fadeOut( milliseconds );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }             
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }         
        }
    }
}
exports.ledFadeOut = ledFadeOut;

function ledFadeIn( milliseconds, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }         
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.fadeIn( milliseconds );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }            
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }       
        }
    }
}
exports.ledFadeIn = ledFadeIn;

function ledBrightness( value, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }          
    }

    if( value < 0 || value > 255 )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Value between 0 - 255 waiting.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Value between 0 - 255 waiting.', true );
            }
        }
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.brightness( value );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }            
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }         
        }
    }
}
exports.ledBrightness = ledBrightness;

function ledColor( color, callback )
{
    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }         
    }

    if( color == undefined || color == '' )
    {
        color = '#FFFFFF';
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.color( color );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }            
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }          
        }
    }
}
exports.ledColor = ledColor;

function ledIntensity( value, callback )
{

    if( value == undefined  || ( value < 0 || value > 100 ) )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Value between 0 - 255 waiting.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Value between 0 - 255 waiting.', true );
            }
        }      
    }

    if( atom._aoz_led == undefined )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onlederror',
                    message: 'Led not initialized.'
                } );					
            }
            else
            {				
                cb( 'onlederror', 'Led not initialized.', true );
            }
        }        
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aoz_led.intensity( value );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onled'
                    } );					
                }
                else
                {				
                    cb( 'onled', '', false );
                }
            }            
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onlederror',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onlederror', e.message, true );
                }
            }         
        }
    }    
}
exports.ledIntensity = ledIntensity;

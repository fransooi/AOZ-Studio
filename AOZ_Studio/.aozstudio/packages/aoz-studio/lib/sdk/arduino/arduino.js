const { Board, Boards } = require( 'johnny-five' );
const SerialPort = require( 'serialport' );

atom._aozBoard = undefined;
atom._aozBoard_initialized = false;

function listBoards( options, cb, bySocket )
{
    var _list = [];
    try
    {
        var _boards = new Boards();
        console.log( _boards );
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: false,
                    event: 'onlistboards',
                    message: _boards
                } );					
            }
            else
            {				
                cb( 'onlistboards', _boards, false );
            }
        }        
    }
    catch( error )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    message: error.message,
                    event: 'onerror'
                } );					
            }
            else
            {				
                cb( 'onerror', error.message );
            }
        }
        console.error( error.message );				
    }
}
exports.listBoards = listBoards;

function initBoard( options, cb, bySocket )
{
    atom._aozBoard_initialized = false;
    try
    {
        if( options && options.port && options.port != '' )
        {
            atom._aozBoard = new Board( 
            {
                port: new SerialPort( "COM5",
                {
                    baudrate: 9600,
                    buffersize: 1
                } )
            } );
        }
        else
        {
            atom._aozBoard = new Board();
        }

        atom._aozBoard.on( "ready", () => {
            atom._aozBoard_initialized = true;
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onready'
                    } );					
                }
                else
                {				
                    cb( 'onready', '', false );
                }
            } 
        } );

        atom._aozBoard.on( "fail", ( event ) => {
            atom._aozBoard_initialized = false;
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onfail',
                        message: event.message
                    } );					
                }
                else
                {				
                    cb( 'onfail', event.message, true );
                }
            } 
        } ); 
    }
    catch( e )
    {
        atom._aozBoard_initialized = false;
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onboarderror',
                    message: e.message
                } );					
            }
            else
            {				
                cb( 'onboard', e.message, true );
            }
        }        
    }
}
exports.initBoard = initBoard;

function pinMode( options, cb, bySocket )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.pinMode( options.pin, options.mode );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onpinmode'
                    } );					
                }
                else
                {				
                    cb( 'onpinmode', '', false );
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
                        event: 'onpinmode',
                        message:e.message
                    } );					
                }
                else
                {				
                    cb( 'onpinmode', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }    
    }     
}
exports.pinMode = pinMode;

function analogWrite( options, cb, bySocketk )
{
    if( options.value < 0 || options.value > 255 )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onboarderror',
                    message: 'Value between 0 - 255 waiting.'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'Value between 0 - 255 waiting.', true );
            }
        }        
        return;    
    }

    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.analogWrite( options.pin, options.value );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onanalogwrite'
                    } );					
                }
                else
                {				
                    cb( 'onanalogwrite', '', false );
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
                        event: 'onanalogwrite',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onanalogwrite', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }     
    }         
}
exports.analogWrite = analogWrite;

function analogRead( options, cb, bySocket )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.analogRead( options.pin, function( voltage ){
                if( cb )
                {
                    if( bySocket )
                    {
                        cb(	{
                            error: false,
                            event: 'onanalogread',
                            value: voltage
                        } );					
                    }
                    else
                    {				
                        cb( 'onanalogread', voltage, false );
                    }
                }            
            } );
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onanalogread',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onanalogread', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }     
    }          
}
exports.analogRead = analogRead;

function digitalWrite( options, cb, bySocket )
{
    if( options.value !=0 && options.value != 1 )
    {
        if( cb )
        {
            if( bySocket )
            {
                cb(	{
                    error: true,
                    event: 'onboarderror',
                    message: 'Value 0 or 1 waiting.'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'Value 0 - 1 waiting.', true );
            }
        }
        return;    
    }    
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.digitalWrite( options.pin, options.value );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'ondigitalwrite'
                    } );					
                }
                else
                {				
                    cb( 'ondigitalwrite', '', false );
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
                        event: 'ondigitalwrite',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'ondigitalwrite', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }     
    }        
}
exports.digitalWrite = digitalWrite;

function digitalRead( options, cb, bySocket )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.digitalRead( options.pin, function( voltage ){
                if( cb )
                {
                    if( bySocket )
                    {
                        cb(	{
                            error: false,
                            event: 'ondigitalread',
                            value: voltage
                        } );					
                    }
                    else
                    {				
                        cb( 'ondigitalread', voltage, false );
                    }
                }            
            } );
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'ondigitalread',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'ondigitalread', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }      
    }         
}
exports.digitalRead = digitalRead;

function servoWrite( options, cb, bySocket )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.servoWrite( options.pin, options.angle );
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: false,
                        event: 'onservowrite'
                    } );					
                }
                else
                {				
                    cb( 'onservowrite', '', false );
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
                        event: 'onservowrite',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onservowrite', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }   
    }     
}
exports.servoWrite = servoWrite;

function wait( options, cb, bySocket )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.wait( options.milliseconds, function()
            {
                if( cb )
                {
                    if( bySocket )
                    {
                        cb(	{
                            error: false,
                            event: 'onwait'
                        } );					
                    }
                    else
                    {				
                        cb( 'onwait', '', false );
                    }
                } 
            } );           
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onwait',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onwait', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }    
    }          
}
exports.wait = wait;

function loop( options, cb, bySocket )
{
    if( atom._aozBoard && atom._aozBoard_initialized )
    {
        try
        {
            atom._aozBoard.loop( options.milliseconds, function()
            {
                if( cb )
                {
                    if( bySocket )
                    {
                        cb(	{
                            error: false,
                            event: 'onloop'
                        } );					
                    }
                    else
                    {				
                        cb( 'onloop', '', false );
                    }
                } 
            } );           
        }
        catch( e )
        {
            if( cb )
            {
                if( bySocket )
                {
                    cb(	{
                        error: true,
                        event: 'onloop',
                        message: e.message
                    } );					
                }
                else
                {				
                    cb( 'onloop', e.message, true );
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
                    message: 'No board connected'
                } );					
            }
            else
            {				
                cb( 'onboarderror', 'No board connected', true );
            }
        }    
    }     
}
exports.loop = loop;

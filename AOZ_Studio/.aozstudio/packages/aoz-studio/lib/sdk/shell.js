const PATH = require( 'path' );
const FS = require( 'fs' );
const { exec } = require( 'child_process' );
function shellExecute( options, cb, bySocket )
{
    exec( options.cmd, function( error, stdout, stderr ){
        if( error )
        {
            if( bySocket )
            {
                cb( 
                    { 
                        error: true,
                        event: 'onerror', 
                        message: error.message
                    }
                );
            }
            else
            {		
                cb( "onexecute", true, error.message ); ;
            }  
            return
        }

        if( stderr )
        {
            if( bySocket )
            {
                cb( 
                    { 
                        error: true,
                        event: 'onerror', 
                        message: stderr
                    }
                );
            }
            else
            {		
                cb( "onexecute", true, stderr );
            }  
            return
        }  
        if( stdout )
        {
            if( bySocket )
            {
                cb( 
                    { 
                        error: false,
                        event: 'onexecute', 
                        message: stdout
                    }
                );
            }
            else
            {		
                cb( "onexecute", false, stdout );
            }  
            return            
        }                
    } );
}
exports.shellExecute = shellExecute;
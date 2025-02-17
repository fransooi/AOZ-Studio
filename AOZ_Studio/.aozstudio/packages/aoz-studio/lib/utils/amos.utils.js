const PATH = require( 'path' );
const AOZipUtils = require('./aozip.utils');
var AMOSUtils = 
{
    importAMOS: function( path, callback )
    {
        path = PATH.normalize( path );
        var busy = false;
        setTimeout( function()
        {
            atom.waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:import-amos' ) );						
        }, 500 );
                
        var amosPath = path.substring( 0, path.length - 5 );
        
        if ( amosPath != null )
        {
            try
            {
                if ( !busy )
                {
                    busy = true;
                    var transpilerOptions =
                    {
                        sourcePath: path,
                        destinationPath: amosPath,
                        tags: {}
                    }

                    atom.TRANSPILER.convert( transpilerOptions, function( response, message, extra )
                    {
                        if ( response == 'success' )
                        {
                            busy = false;


                            setTimeout( function()
                            {
                                atom.panels.destroyPanel( atom.waitmessagePanel.panel );
                            }, 1500 );

                            AOZipUtils.destroyUsersPath( amosPath );
                            if( callback )
                            {
                                callback( "no", amosPath );
                            }
                        }
                        else
                        {
                            if ( response == 'failure' )
                            {
                                busy = false;
                                setTimeout( function()
                                {
                                    atom.panels.destroyPanel( atom.waitmessagePanel.panel );
                                }, 1500 );

                                AOZipUtils.destroyUsersPath( amosPath );
                                if( callback )
                                {
                                    callback( "failure", "" );
                                }
                            }
                        }
                    } );
                }
                return true;
            }
            catch( e )
            {
                console.log( e );
                AOZipUtils.destroyUsersPath( amosPath );
                busy = false;
                if( callback )
                {
                    callback( e, "" );
                }			
            }
            return false;
        }	    
    }
}
module.exports = AMOSUtils;
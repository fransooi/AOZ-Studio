const PATH = require( 'path' );
const FS = require( 'fs' );
const JSZIP = require( 'jszip' );
const AOZIO = require( '../aoz-io.js' );
var AOZipUtils = 
{
    savePackage: function( path, callback )
    {
        var zipPath =  PATH.normalize( path ) + '/' + PATH.basename( path ) + '.aozip';
        try
        {
            var dejaErr = false;
            var zip = new JSZIP();
            var tree = atom.editorSDK.filesystem.getDirectory( { path: path, recursive: true } );

            if ( tree )
            {
                
                zipIt( tree );
                
                zip.generateAsync( { type: "nodebuffer" } ).then( function( content )
                {
                    FS.writeFile( zipPath, content, function( err )
                    {
                        if( err )
                        {
                            if( !dejaErr )
                            {
                                dejaErr = true;
                                if( callback )
                                {
                                    callback( err );
                                }
                            }
                        }
                    } );
                } );
                
                if( dejaErr )
                {
                    if( callback )
                    {
                        callback( err );
                    }
                    return false;				
                }
            } 
    
            if( callback )
            {
                callback( "" );
            }
            return true;		
        }
        catch( err )
        {
            console.log( err );
            if( callback )
            {
                callback( err );
            }
            return false;		
        };
        
        function zipIt( tree )
        {
            for ( var f in tree )
            {
                var file = tree[ f ];
                if ( file.type == 0 )
                {
                    var localPath = file.path.substring( PATH.normalize( path ).length + 1 );
                    zip.folder( PATH.normalize( localPath ) );
                    zipIt( file.files );
                }
                else
                {
                    var localPath = file.path.substring( PATH.normalize( path ).length + 1 );
                    zip.file( localPath, FS.readFileSync( file.path ), { createFolders: true } );
                }
            }		
        };
    },

    loadPackage: function( path, callback )
    {
        if( FS.existsSync( path ) && FS.statSync( path ).isFile() )
        {
            if( PATH.extname( path ).toLowerCase() == '.aozip' )
            {
                //var targetPath = PATH.normalize( path ).strReplace( '.aozip', '' );
                var targetPath = atom.rootPath + "/my_aoz_applications/" + PATH.basename( path ).strReplace( '.aozip', '' );

                if( !FS.existsSync( targetPath ) )
                {
                    FS.mkdirSync( targetPath );
                }
                
                try
                {
                    var buffer = FS.readFileSync( path );
                    var zip = new JSZIP();
                    var destPath = '';
                    zip.loadAsync( buffer ).then( function( contents )
                    {
                        var count = 0;
                        for ( var f in contents.files )
                        {
                            count++;
                        }
                        
                        contents.forEach( function( relativePath, file )
                        {
                            var dirPath = targetPath + '/' + file.name;
                            if ( file.dir )
                            {
                                if( !FS.existsSync( dirPath ) )
                                {
                                   FS.mkdirSync( dirPath );
                                }
                                count--;

                                if ( count == 0 )
                                {
                                    AOZipUtils.destroyUsersPath( targetPath );
                                    if( callback )
                                    {
                                        callback( "no", destPath );
                                    }
                                }
            
                            }
                            else
                            {
                                file.async( 'nodebuffer' ).then( function( content )
                                {
                                    if( PATH.extname( file.name ).toLowerCase() == '.aoz' )
                                    {
                                        destPath = dirPath;
                                    }

                                    try
                                    {
                                        setTimeout( function()
                                        {
                                            FS.writeFileSync( dirPath, content );
                                        }, 500 );
                                    }
                                    catch( e )
                                    {
                                        AOZipUtils.destroyUsersPath( targetPath );
                                        if( callback )
                                        {
                                            callback( e, '' );
                                        }                                        
                                        console.log( e );
                                    }
                                    count--;
                                    if ( count == 0 )
                                    {
                                        AOZipUtils.destroyUsersPath( targetPath );
                                        if( callback )
                                        {
                                            callback( "no", destPath );
                                        }
                                    }
                                } );
                            }
                        } );
                        /**
                        if( callback )
                        {
                            AOZipUtils.destroyUsersPath( targetPath );
                            callback( "no", destPath );
                        }
                        */
                    } );
                }
                catch ( e )
                {
                    AOZipUtils.destroyUsersPath( targetPath );
                    if( callback )
                    {
                        callback( e, '' );
                    }
                }
                            
            }
        }
    },
    
    destroyUsersPath: function( path )
    {
        setTimeout( function()
        {
            var fuckingUsersPath = PATH.basename( path ) + '/Users';
            console.log( fuckingUsersPath );
            if( FS.existsSync( path ) && FS.statSync( path ).isDirectory() )
            {
                if( process.platform == 'darwin' )
                {
                    AOZIO.execCommand( 'rm -R \'' + fuckingUsersPath + '\'', { cwd: PATH.basename( path ) } );
        
                }

                if( process.platform == 'linux' )
                {
                    AOZIO.execCommand( 'rm -rf \'' + fuckingUsersPath + '\'', { cwd: PATH.basename( path ) } );
        
                }            
            }
        }, 2000 );
    }
}
module.exports = AOZipUtils
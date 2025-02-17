const { exec } =  require( 'child_process' );
const FS = require( 'fs' );
const checksum = require( 'checksum' );

function verifyApp( path, cbSuccess, cbError )
{
    var app = getCheckApp( path );
    if( !FS.existsSync( app ) )
    {
        console.error( '{ "status": "licence-checker-not_found" }' );
        process.exit( 1 );
    }

    checksum.file( app, function( err, sum )
    {
        /**
        if( sum != 'a8d670872b386089d1870e75ec48b2637ba36804' && process.platform == 'win32' )
        {
            console.error( '{ "status": "invalid-licence-checker" }' );
            process.exit( 1 );            
        }

        if( sum != 'eab7cb177eb6717009ccb2ef19b185bf2792271a' && process.platform == 'darwin' )
        {
            console.error( '{ "status": "invalid-licence-checker" }' );
            process.exit( 1 );            
        }        

        if( sum != '8942f32d07b3bf1684fdda5e37116bf31278a626' && process.platform == 'linux' )
        {
            console.error( '{ "status": "invalid-licence-checker" }' );
            process.exit( 1 );            
        }        
        */
    } );

    exec( '"' + getCheckApp(path) + '" --v',( error, stdout, stderr ) => {
        if( error )
        {
            if( cbError )
            {
                console.log( error );
                cbError( error );
            }
            else
            {
                console.error(`exec error: ${error}`);
            }
            return;
        }
    
        if( stdout && stdout != '' )
        {
            var json = JSON.parse ( stdout );
            if( cbSuccess )
            {
                cbSuccess( json );
            }
            else
            {
                console.log( json );
            }
        }
    
        if( stderr && stderr != '' )
        {
            var json = JSON.parse ( stderr );
            if( cbError )
            {
                cbError( json );
            }
            else
            {
                console.error( json );
            }            
        }

    } );    
}
module.exports.verifyApp = verifyApp;

function getCheckApp( path )
{
    if( path == undefined || path.trim() == '' )
    {
        path = '.';
    }
    
    if( path.startsWith( '"' ) )
    {
        path = path.substring( 1, path.length );
    }

    if( path.endsWith( '"' ) )
    {
        path = path.substring( 0, path.length - 2 );
    }

    var app = path + '/check-' + process.platform + ( ( process.platform == 'win32' ) ? '.exe' : '' );
    if( !FS.existsSync( app ) )
    {
        console.error( '{ "status": "licence-checker-not-found" }' );
        process.exit (1 );
    } 
    return app;
}

function authenticateToken( path, token, cbSuccess, cbError )
{
    exec( '"' + getCheckApp( path ) + '" --token=' + token,( error, stdout, stderr ) => {
        if( error )
        {
            if( cbError )
            {
                console.log( error );
                cbError( error );
            }
            else
            {
                console.error(`exec error: ${error}`);
            }
            return;
        }
    
        if( stdout && stdout != '' )
        {
            var json = JSON.parse ( stdout );
            if( cbSuccess )
            {
                cbSuccess( json );
            }
            else
            {
                console.log( json );
            }
        }
    
        if( stderr && stderr != '' )
        {
            var json = JSON.parse ( stderr );
            if( cbError )
            {
                cbError( json );
            }
            else
            {
                console.error( json );
            }            
        }

    } );
}
module.exports.authenticateToken = authenticateToken;

function authenticate( path, login, password, cbSuccess, cbError )
{
    exec( '"' + getCheckApp( path ) + '" --login=' + login + "+" + password,( error, stdout, stderr ) => {
        if( error )
        {
            if( cbError )
            {
                cbError( error );
            }
            else
            {
                console.error(`exec error: ${error}`);
            }
            return;
        }
    
        if( stdout && stdout != '' )
        {
            var json = JSON.parse ( stdout );
            if( cbSuccess )
            {
                cbSuccess( json );
            }
            else
            {
                console.log( json );
            }
        }
    
        if( stderr && stderr != '' )
        {
            var json = JSON.parse ( stderr );
            if( cbError )
            {
                cbError( json );
            }
            else
            {
                console.error( json );
            }            
        }
    } );
}
module.exports.authenticate = authenticate;

function checkSerial( path, token, serial, sid, cbSuccess, cbError )
{
    exec( '"' + getCheckApp( path ) + '" --serial=' + token + '+' + serial + "+" + sid,( error, stdout, stderr ) => {
        if( error )
        {
            if( cbError )
            {
                cbError( error );
            }
            else
            {
                console.error(`exec error: ${error}`);
            }
            return;
        }
    
        if( stdout && stdout != '' )
        {
            var json = JSON.parse ( stdout );
            if( cbSuccess )
            {
                cbSuccess( json );
            }
            else
            {
                console.log( json );
            }
        }
    
        if( stderr && stderr != '' )
        {
            var json = JSON.parse ( stderr );
            if( cbError )
            {
                cbError( json );
            }
            else
            {
                console.error( json );
            }            
        }
    } );
}
module.exports.checkSerial = checkSerial;

function getAuthorCertificate( path, token, sid, cbSuccess, cbError )
{
    exec( '"' + getCheckApp( path ) + '" --author=' + token + '+' + sid, ( error, stdout, stderr ) => {
        if( error )
        {
            if( cbError )
            {
                cbError( error );
            }
            else
            {
                console.error(`exec error: ${error}`);
            }
            return;
        }
    
        if( stdout && stdout != '' )
        {
            var json = JSON.parse ( stdout );
            if( cbSuccess )
            {
                cbSuccess( json );
            }
            else
            {
                console.log( json );
            }
        }
    
        if( stderr && stderr != '' )
        {
            var json = JSON.parse ( stderr );
            if( cbError )
            {
                cbError( json );
            }
            else
            {
                console.error( json );
            }            
        }
    } );
}
module.exports.getAuthorCertificate = getAuthorCertificate;

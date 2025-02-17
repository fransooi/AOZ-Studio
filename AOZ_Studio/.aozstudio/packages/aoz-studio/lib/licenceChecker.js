const { exec } =  require( 'child_process' );
const PATH = require( 'path' );
const FS = require( 'fs' );
const AOZCert = require( './aoz-cert.js' );

function getCheckApp()
{
    var path = atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler';
    var app = path + '/check-' + process.platform + ( ( process.platform == 'win32' ) ? '.exe' : '' );
    if( !FS.existsSync( app ) )
    {
        console.error( '{ "status": "invalid-licence-checker" }' );
        process.exit (1 );
    } 
    return app;
}

function authenticateToken( token, cbSuccess, cbError )
{
    if( atom.waitmessagePanel )
    {
        atom.waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:authenticate-token' ) );
    }

    exec( '"' + getCheckApp() + '" --token=' + token,( error, stdout, stderr ) => {
        atom.panels.destroyPanel( atom.waitmessagePanel.panel );
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
module.exports.authenticateToken = authenticateToken;

function authenticate( login, password, cbSuccess, cbError )
{
    if( atom.waitmessagePanel )
    {
        atom.waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:authenticate' ) );
    }
    exec( '"' + getCheckApp() + '" --login=' + login + "+" + password,( error, stdout, stderr ) => {
        atom.panels.destroyPanel( atom.waitmessagePanel.panel );
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

function checkSerial( token, serial, sid, cbSuccess, cbError )
{
    if( atom.waitmessagePanel )
    {
        atom.waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:check-serial' ) );
    }    
    exec( '"' + getCheckApp() + '" --serial=' + token + '+' + serial + "+" + sid,( error, stdout, stderr ) => {
        atom.panels.destroyPanel( atom.waitmessagePanel.panel );
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

function getAuthorCertificate( token, sid, cbSuccess, cbError )
{
    if( atom.waitmessagePanel )
    {
        atom.waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:get-author-certificate' ) );
    }
    exec( '"' + getCheckApp() + '" --author=' + token + '+' + sid,( error, stdout, stderr ) => {
        atom.panels.destroyPanel( atom.waitmessagePanel.panel );
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

function disconnect()
{
	new AOZCert().setAuthorCertificate( '' );
	atom.licenceType = 'AOZF';
    atom.token = '';
	atom.tokenChecked = false;
	atom.serialChecked = false;
	atom.authCertChecked = false;	
	if( atom.aozConfig && atom.aozConfig.aoz_settings )
	{
		delete atom.aozConfig.aoz_settings.auth_cert;
		delete atom.aozConfig.aoz_settings.serial;
		delete atom.aozConfig.aoz_settings.token;
		delete atom.aozConfig.aoz_settings.uid;
		atom.AOZIO.saveHJSON( atom.aozConfig.aoz_settings, atom.userConfigPath + '/user.hjson' );	
	}
}
module.exports.disconnect = disconnect;
const fetch = require( 'node-fetch' );
const url_base = 'https://account.aoz.studio/app'
const urlAnd = ( url, get ) => url + ( url.includes( '?' ) ? '&' : '?' ) + get;

const postData = function( post )
{
	const pairs = []
	for ( const name in post )
	{
		pairs.push( encodeURIComponent( name ) + '=' + encodeURIComponent( post[name] ) )
	}
	return pairs.join( '&' )
}
var version = '14.03';
var cmd = '';
var token = undefined;
var login = undefined;
var password = undefined;
var serial = undefined;
var sid = undefined;

// On cherche dans les arguments passés
for ( var a = 2; a < process.argv.length; a++ )
{
    var arg = process.argv[ a ];
    
    if( arg.substring( 0, 3 ).toLowerCase() == '--v' )
    {
        cmd = 'version';
        break;
    }

    if( arg.substring( 0, 8 ).toLowerCase() == '--token=' )
    {
        cmd = 'token';
        token = arg.substring( 8, arg.length );
        if( token == '' )
        {
            console.log( '{ "status": "NO", "text": "wrong-token" }' );            
            process.exit( 0 );
        }
        break;
    }

    if( arg.substring( 0, 8 ).toLowerCase() == '--login=' )
    {
        cmd = 'login';
        var value = arg.substring( 8, arg.length );
        if( value == '' )
        {
            console.log( '{ "status": "NO", "text": "wrong-login" }' );            
            process.exit( 0 );
        }
        
        var parts = value.split( '+' );
        if( parts.length != 2 )
        {
            console.log( '{ "status": "NO", "text": "wrong-login" }' );            
            process.exit( 0 );
        }

        login = parts[ 0 ];
        password = parts[ 1 ];
        break;
    }

    if( arg.substring( 0, 9 ).toLowerCase() == '--serial=' )
    {
        cmd = 'serial';
        var value = arg.substring( 9, arg.length );
        if( value == '' )
        {
            console.log( '{ "status": "NO", "text": "wrong-serial" }' );            
            process.exit( 0 );
        }
        
        var parts = value.split( '+' );
        if( parts.length != 3 )
        {
            console.log( '{ "status": "NO", "text": "wrong-serial" }' );            
            process.exit( 0 );
        }
        token = parts[ 0 ]
        serial = parts[ 1 ];
        sid = parts[ 2 ];
        break;
    } 
    
    if( arg.substring( 0, 9 ).toLowerCase() == '--author=' )
    {
        cmd = 'author';
        var value = arg.substring( 10, arg.length );
        if( value == '' )
        {
            console.log( '{ "status": "NO", "text": "wrong-author" }' );            
            process.exit( 0 );
        }

        var parts = value.split( '+' );
        if( parts.length != 2 )
        {
            console.log( '{ "status": "NO", "text": "wrong-author" }' );            
            process.exit( 0 );
        }

        token = parts[ 0 ];
        sid = parts[ 1 ];        
        break;
    }    
} 

switch( cmd )
{
    case 'version':
        console.log( '{ "status": "ok", "version": "' + version + '" }' );
        process.exit( 0 );
        
    case 'login':
        fetch( urlAnd( url_base + '/ITRocks/Framework/User/authenticate', 'X'),
        { 
            method: 'POST', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: postData( { login: login, password: password, newToken: true } ),
            timeout: 5000    
        } )
        .then( response => response.text() )
        .then( text => {
            text = text.trim();
            if ( text.startsWith( '{' ) && text.endsWith( '}' ) )
            {
                console.log( text );
                process.exit( 0 );
            }
            else if ( text.startsWith( 'OK:TOKEN:[' ) && text.endsWith( ']' ) )
            {
                const token = text.substring( 10, text.length - 1 )
                console.log( '{ "status": "ok", "token": "' + token + '", "sid": "" }' );
                process.exit( 0 );
            }
            else
            {
            console.log( '{ "status": "NO" }' );
            process.exit( 0 );
            }    
        } )
        .catch( error => {
            console.error( error );
            process.exit( 1 );
        } );

        break;
    
    case 'token':
        fetch( urlAnd( url_base, 'X' ),
        { 
            method: 'POST', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: postData( { checkToken: true, TOKEN: token } ),
            timeout: 5000    
        } )
        .then( response => response.text() )
        .then( text => {
            text = text.trim();
            if ( text.startsWith( '{' ) && text.endsWith( '}' ) )
            {
                console.log( text );
                process.exit( 0 );
            }
            else if ( text.startsWith( 'OK:TOKEN:[' ) && text.endsWith( ']' ) )
            {
                const token = text.substring( 10, text.length - 1 )
                console.log( '{ "status": "ok" }' );
                process.exit( 0 );
            }
            else
            {
                console.log( '{ "status": "NO" }' );
                process.exit( 0 );
            }    
        } )
        .catch( error => {
            console.error( error );
            process.exit( 1 );
        } );
        break;
    
    case 'serial':
        fetch( urlAnd( url_base + '/Aoz/Account/API/checkLicence?licence=' + serial + '&PHPSESSID=' + sid ),
        { 
            method: 'POST', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: postData( { checkToken: true, TOKEN: token } ),
            timeout: 5000    
        } )
        .then( response => response.text() )
        .then( text => {
            text = text.trim();
            if ( text.startsWith( '{' ) && text.endsWith( '}' ) )
            {
                console.log( text );
                process.exit( 0 );
            }
            else if ( text.startsWith( 'OK:TOKEN:[' ) && text.endsWith( ']' ) )
            {
                const token = text.substring( 10, text.length - 1 )
                console.log( '{ "status": "ok" }' );
                process.exit( 0 );
            }
            else
            {
            console.log( '{ "status": "NO" }' );
            process.exit( 0 );
            }    
        } )
        .catch( error => {
            console.error( error );
            process.exit( 1 );
        } );
        break;

    case 'author':
        fetch( urlAnd( url_base + '/Aoz/Account/API/getCertificate?PHPSESSID=' + sid ),
        { 
            method: 'POST', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: postData( { TOKEN: token } ),
            timeout: 5000    
        } )
		.then( response => response.text() )
        .then( text => {
            console.log( text );
            process.exit( 0 );
        } )
        .catch( error => {
            console.error( error );
            process.exit( 1 );
        } );
    break;

    default:
        console.error( "arguments error" );
        process.exit( 1 );        
   
}





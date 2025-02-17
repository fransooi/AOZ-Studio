const PATH = require( 'path' );
const FS = require( 'fs' );
const AmigaTranspiler = require( './lib/transpiler.js' );

var myArgs = process.argv.slice( 2 );

var fileSource = myArgs[ 0 ];
var transpilerPath = myArgs[ 1 ];
if( !FS.existsSync( fileSource ) )
{
    throw( 'ERROR: ' + fileSource + ' not found.' );
}

if( !FS.existsSync( transpilerPath ) )
{
    throw( 'ERROR: ' + transpilerPath + ' not found.' );
}
AmigaTranspiler.transpile( fileSource, transpilerPath );

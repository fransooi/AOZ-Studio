const PATH = require( 'path' );
const FS = require( 'fs' );
const OS = require( 'os' ); 
const { exec } = require("child_process");
var nl = 0;

var AmigaTranspiler = 
{
    callback: undefined,
    transpilerPath: undefined,
    transpile: function( workPath, transpilerPath, callback )
    {
        nl = 1;
        this.callback = callback;
        this.transpilerPath = transpilerPath;
        this.preparePath( workPath );
    },

    preparePath: function( workPath )
    {
        var projectPath = workPath;
        workPath = PATH.dirname( workPath );
        if( FS.existsSync( this.transpilerPath + '/system/hd/AOZTranspiler/tmp' ) )
        {
            FS.rmSync( this.transpilerPath + '/system/hd/AOZTranspiler/tmp', { recursive: true, force: true } );
            FS.mkdirSync( this.transpilerPath + '/system/hd/AOZTranspiler/tmp' );
        }
    
        if( FS.existsSync( workPath + '/resources' ) )
        {
            if( FS.existsSync( workPath + '/resources/filesystem' ) )
            {
                if( FS.existsSync( workPath + '/resources/filesystem/application' ) )
                {
                    copyRecursiveSync( workPath + '/resources/filesystem/application', this.transpilerPath + '/system/hd/AOZTranspiler/tmp' );
                }				
            }
        }

        var code = '';
        if( FS.existsSync( projectPath ) )
        {
            code = this.getCodeForAmiga( projectPath ) ;
            FS.writeFileSync( this.transpilerPath + '/system/hd/AOZTranspiler/tmp/code.asc', code );

            if( this.callback )
            {
                this.callback( { error: false, warn: false, over: true, command: 'exec_emu', message: '' } );
                return;
            }                        
            this.launchEmulator();
            return;
        }
        else
        {
            if( callback )
            {
                callback( 'failure' );
            }
        }
    },

    getCodeForAmiga: function( path )
    {
        code = FS.readFileSync( path ).toString();
        code = this.cleanCode( path, code );

        return code;
    },

    cleanCode: function( path, code )
    {
        var ncode = code.strReplace( "\n", "" );
        var lines = ncode.split( "\r" );
        var suppr = false; 
        var aozSuppr = false;
        var emuAdd = false;

        var code = "";
        for( var l = 0 ; l < lines.length; l++ )
        {
            var line = lines[ l ];
            line = line.trim();

            // Code AOZ strict
            if( line.substring( 0, 7 ).toLowerCase() == '// @aoz' )
            {
                line = '';
                aozSuppr = true;
            }

            // Code EMU Strict 
            if( line.substring( 0, 7 ).toLowerCase() == '// @emu' )
            {
                line = '';
                emuAdd = true;
            }
            
            if( line.substring( 0, 7 ).toLowerCase() == '// @end' )
            {
                line = '';
                aozSuppr = false;
                emuAdd = false;
            }

            if( line.substring( 0, 3 ).toLowerCase() == '// ' && emuAdd )
            {
                line = line.substring( 2, line.length );
            }

            // Comments
            if( line.substring( 0, 2 ).toLowerCase() == '//' )
            {
                line = '';
            }

            if( line.substring( 0, 3 ).toLowerCase() == '/**' )
            {
                line = '';
                suppr = true;                
            }

            if( line.substring( 0, 2 ).toLowerCase() == '*/' )
            {
                line = '';
                suppr = false;                
            }
            
            if( line.substring( 0, 2 ).toLowerCase() == '/*' )
            {
                line = '';
            }

            if( line.substring( line.length - 3, line.length - 1 ).toLowerCase() == '*/' )
            {
                line = '';
                suppr = false;                
            }

            if( line.length == 3  && line.substring( 0, 3 ).toLowerCase() == 'rem' )
            {
                line = '';
            }

            if( line.substring( 0, 4 ).toLowerCase() == 'rem ' )
            {
                line = '';
            }
            
            if( line.substring( 0, 1 ).toLowerCase() == "'" )
            {
                line = '';
            }

            // Tags
            if( line.substring( 0, 1 ).toLowerCase() == '#' )
            {
                line = '';
            }            

            // Include
            if( line.substring( 0, 8 ).toLowerCase() == 'include ' )
            {
                var incPath = line.substring( 8, line.length - 1 );
                if( FS.existsSync( PATH.dirname( path ) + '/' + incPath.strReplace( '"', '' ) ) )
                {
                    var incCode = FS.readFileSync( PATH.dirname( path ) + '/' + incPath.strReplace( '"', '' ) );
                    code = code + "\r\n" + this.cleanCode( path, incCode.toString() );
                }
                line = '';
            }            

            if( suppr || aozSuppr )
            {
                line = '';
            }

            if( line != '' )
            {
                var warns = this.checkLineForAOZReservedKeywords( line );
                if( warns )
                {
                    for( var w = 0; w < warns.length; w++ )
                    {
                        if( this.callback )
                        {
                            this.callback( { error: false, warn: true, over: false, command: '', message: warns[ w ] } );
                        }
                        console.warn( warns[ w ] );
                    }
                }

                if( code != '' )
                {
                    code = code + "\r\n";
                }
                code = code + line;
                nl++;
            }
        }

        return code;
    },

    checkLineForAOZReservedKeywords: function( line )
    {
        line = line.toLowerCase();

        // Mots clés réservés à la syntaxe AOZ (à completer)
        var aozKey =
        [
            'actor ', 'del actor', 'reset actor', 'mouse on actor', 'del all actors',
            'load asset', 'del asset', 'json asset',
            'html ', 'show html', 'js execute', 'console error', 'console log', 'console warn', 'image dataurl',
            'bob shadow', 'bob scale', 'bob rotate', 'bob skew', 'bob collide', 'bob point', 'sprite point',
            'rgba', 'gamepad ', 'db ', 'draw image', 'firebase', 'bitmap text', 'set bitmap font',
            'audio loop', 'pause audio', 'play audio', 'stop audio', 'set display', 'time audio', 'volume audio',
            'video loop', 'draw video', 'pause video', 'play video', 'stop video', 'time video', 'volume video'
        ]

        var warns = undefined;
        for( var k = 0; k < aozKey.length;  k++ )
        {
            if( line.indexOf( aozKey[ k ] ) > -1 )
            {
                if( warns == undefined ) warns = [];
                warns.push( 'WARNING: Your program uses "' +  aozKey[ k ].trim().toUpperCase() + '" in line ' + nl + '. This keyword is reserved to AOZ and not supported by the Amiga System.' );
            }
        }
        return warns;
    },

    launchEmulator: function( callback )
    {
        this.callback = callback;
        var self = this;
        var appEmu = ''; 

        if( process.platform == 'win32' )
        {

            if( FS.existsSync( this.transpilerPath + '/system/bin/win32/winuae.exe' ) )
            {
                appEmu = 'winuae.exe';
            }
            else
            {
                if( FS.existsSync( this.transpilerPath + '/system/bin/win32/winuae64.exe' ) )
                {
                    appEmu = 'winuae64.exe';
                }
            }

            if( appEmu == '' )
            {
                if( self.callback )
                {
                    self.callback( { error: true, warn: false, over: true, command: 'download_emu', message: 'emu_not_found' } );
                    return;
                }
                console.error( 'WinUAE Amiga Emulator not found.' );
                return;
            }
            else
            {
                if( FS.existsSync( this.transpilerPath + '/system/bin/win32/roms' ) )
                {
                    FS.readdir( this.transpilerPath + '/system/bin/win32/roms', function( error, files )
                    {
                        var noroms = false;
                        if( error || files == undefined || files.length == 0 )
                        {
                            noroms = true;
                        }
    
    
                        if( noroms )
                        {
                            if( self.callback )
                            {
                                self.callback( this, { error: true, warn: false, over: true, command: 'message_roms', message: 'roms_not_found' } );
                                return;
                            }
                            console.warn( 'Amiga Kickstart Rom not found! Visit https://www.amigaforever.com/ for more informations.' );
                            return;
                        }
                    } );
                }

                exec( '"' + this.transpilerPath + '/system/bin/win32/' + appEmu + '" -config=AOZTranspiler.uae', ( error, stdout, stderr ) => 
                {
                    if( error )
                    {
                        if( self.callback )
                        {
                            self.callback( { error: true, warn: false, over: true, command: 'show_error', message: error.message } );
                            return;
                        }                        
                        console.error( 'Execution error! ' + error.message );
                        return;
                    }

                    if( stderr )
                    {
                        if( self.callback )
                        {
                            self.callback( { error: true, warn: false, over: true, command: 'show_error', message: stderr } );
                            return;
                        }                        
                        console.error( 'Execution error! ' + stderr );
                        return;
                    }

                    if( self.callback )
                    {
                        self.callback( { error: false, warn: false, over: true, command: 'no_error', message: '' } );
                        return;
                    }                        
                    return;
                } );                
            }
        }

        if( process.platform == 'darwin' )
        {

            if( FS.existsSync( this.transpilerPath + '/system/bin/darwin/FS-UAE.app/Contents/MacOS/fs-uae' ) )
            {
                appEmu = 'fs-uae';
            }

            if( appEmu == '' )
            {
                if( self.callback )
                {
                    self.callback( { error: true, warn: false, over: true, command: 'download_emu', message: 'emu_not_found' } );
                    return;
                }
                console.error( 'FS-UAE Amiga Emulator not found.' );
                return;
            }
            else
            {
                if( FS.existsSync( OS.homedir() + '/Documents/FS-UAE/Kickstarts' ) )
                {
                    FS.readdir( OS.homedir() + '/Documents/FS-UAE/Kickstarts', function( error, files )
                    {
                        var noroms = false;
                        if( error || files == undefined || files.length == 0 )
                        {
                            noroms = true;
                        }
    
    
                        if( noroms )
                        {
                            if( self.callback )
                            {
                                self.callback( this, { error: true, warn: false, over: true, command: 'message_roms', message: 'roms_not_found' } );
                                return;
                            }
                            console.warn( 'Amiga Kickstart Rom not found! Visit https://www.amigaforever.com/ for more informations.' );
                            return;
                        }
                    } );
                }

                exec( 'open "' + this.transpilerPath + '/system/bin/darwin/' + appEmu + '"', ( error, stdout, stderr ) => 
                {
                    if( error )
                    {
                        if( self.callback )
                        {
                            self.callback( { error: true, warn: false, over: true, command: 'show_error', message: error.message } );
                            return;
                        }                        
                        console.error( 'Execution error! ' + error.message );
                        return;
                    }

                    if( stderr )
                    {
                        if( self.callback )
                        {
                            self.callback( { error: true, warn: false, over: true, command: 'show_error', message: stderr } );
                            return;
                        }                        
                        console.error( 'Execution error! ' + stderr );
                        return;
                    }

                    if( self.callback )
                    {
                        self.callback( { error: false, warn: false, over: true, command: 'no_error', message: '' } );
                        return;
                    }                        
                    return;
                } );                
            }
        }

    }
}
module.exports = AmigaTranspiler;

function copyRecursiveSync( src, dest )
{
	var exists = FS.existsSync( src );
	var stats = exists && FS.statSync( src );
	var isDirectory = exists && stats.isDirectory();
	if( isDirectory )
	{
		if( !FS.existsSync( dest ) )
		{
			console.log( dest );
			FS.mkdirSync( dest );
		}
		FS.readdirSync( src ).forEach( function( childItemName )
		{
			copyRecursiveSync( PATH.join( src, childItemName ),	PATH.join( dest, childItemName ) );
		} );
	}
	else
	{
		FS.copyFileSync( src, dest );
	}
};

String.prototype.strReplace = function( strSearch, strReplace )
{
	var newStr = '';
	for( n = 0; n < this.length; n++ )
	{
		var part = this.substr( n, strSearch.length );
		if( part == strSearch )
		{
			newStr = newStr + strReplace;
			n = n + ( strSearch.length - 1 );
		}
		else
		{
			newStr = newStr + part.substr( 0, 1 );
		}
	}

	return newStr;
}

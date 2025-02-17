const FS = require( 'fs' );
const PATH = require( 'path' );
const REMOTE = require( 'remote' );

class AOZThemeManager 
{
	constructor()
	{
		this.currentTheme = 'default';
	};
	
	updateTheme( themeName, callback )
	{
		var dirSep = PATH.sep;
		//
		// Mise à jour du thème AOZ
		//
		if( themeName == undefined || themeName == '' )
		{
			themeName = 'default';
		}
		
		var themePath = atom.aozConfig.installInformation.themesPath + dirSep + themeName;
		var encodedThemePath = themePath;
		
		if( process.platform == 'win32' )
		{
			encodedThemePath = themePath.strReplace( dirSep, dirSep + dirSep );
		}
		
		if( process.platform == 'darwin' )
		{
			encodedThemePath = themePath;
		}
		
		var pathFontsCSS = themePath + PATH.sep + 'fonts.css';
		var pathIconsJS = themePath + PATH.sep + 'icons';
		var pathImagesJS = themePath + PATH.sep + "images"
		var pathGlobalCSS = themePath + PATH.sep + 'global.css';

		if( FS.existsSync( themePath + PATH.sep + 'fonts_' + process.platform + '.css' ) )
		{
			pathFontsCSS = themePath + PATH.sep + 'fonts_' + process.platform + '.css';
		}

		if( FS.existsSync( themePath + PATH.sep + 'icons_' + process.platform + '.js' ) )
		{
			pathIconsJS = themePath + PATH.sep + 'icons_' + process.platform;
		}
		
		if( FS.existsSync( themePath + PATH.sep + 'images_' + process.platform + '.js' ) )
		{
			pathImagesJS = themePath + PATH.sep + 'images_' + process.platform;
		}
		
		if( FS.existsSync( themePath + PATH.sep + 'global_' + process.platform + '.css' ) )
		{
			pathFontsCSS = themePath + PATH.sep + 'global_' + process.platform + '.css';
		}

		if( FS.existsSync( pathFontsCSS ) )
		{
			FS.readFile( pathFontsCSS, 'utf8', function( err, data )
			{
				
				if( data )
				{
					data = data.strReplace( "%THEME%", encodedThemePath );
					var style = document.createElement( 'style' );
					style.setAttribute( 'type', 'text/css' );
					style.innerHTML = data;
					document.body.appendChild( style );
				}
					
			} );
		}
	
		if ( FS.existsSync( pathIconsJS + '.js' ) )
		{	
			atom.ICONS = new Object();
			atom.ICONS = require( pathIconsJS );
		}

		if ( FS.existsSync( pathImagesJS + '.js' ) )
		{	
			atom.IMAGES = new Object();
			atom.IMAGES = require( pathImagesJS );
		}

		if ( FS.existsSync( pathGlobalCSS ) )
		{	
			FS.readFile( pathGlobalCSS, 'utf8', function( err, data )
			{
			
				if( data )
				{
					data = data.strReplace( "%THEME%", encodedThemePath );
					var style = document.createElement( 'style' );
					style.setAttribute( 'type', 'text/css' );
					style.innerHTML = data;
					document.body.appendChild( style );
				}
				
			} );
		}		
		this.currentTheme = themePath;
		
		if( callback )
		{
			callback();
		}
	};
};

module.exports = AOZThemeManager;

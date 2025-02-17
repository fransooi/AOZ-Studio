/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* This source should not be distributed.                                       *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Transpiler
 *
 * Banks compiler
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 22/12/2018
 */
var fs = require( 'fs' );
var utilities = require( './utilities' );
var tokens = require( './tokens' );
var messages = require( './messages' );
var HJSON = require( 'hjson' );
var PATH = require("path");

var googleFontsDone;
var amigaFontsDone;
function init( information, options )
{
	googleFontsDone = {};
	amigaFontsDone = {};
	return true;
};
module.exports.init = init;

// TODO-> force load of sound module if sounds are present!
function compileBanks( options, baseOptions )
{
	// Default banks
	options.fileSaver.createDirectories( options.destinationPath + '/resources' );

	// Application banks
	var counts = {};
	var files = options.fileLoader.findDirectoryFiles( options.sourcePath + '/resources', { directories: true, recursive: false, errors: false } );
	if ( files )
	{
		var iconsDone = false;
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( file.isDirectory )
			{
				var number = undefined;
				var pos;
				if ( ( pos = file.name.indexOf( '.' ) ) > 0 )
				{
					number = parseInt( file.name.substring( 0, pos ) );
					if ( isNaN( number ) )
					{
						messages.pushError( { compilerWarning: 'illegal_bank_element_filename', parameter: file.name } );
						number = undefined;
					}
					pos++;
				}
				else
				{
					pos = 0;
				}

				var done = false;
				if ( file.name.indexOf( 'images' ) == pos )
				{
					if ( !number )
						number = getNumber( counts, 1 );
					counts[ number ] = true;
					messages.print( messages.VERBOSE_DEV1, 'compiling_images' );
					options.banks[ number ] = compileImages( 'images', file.path, number, file.name, options, baseOptions );
					done = true;
				}
				else if ( file.name.indexOf( '3D' ) == pos )
				{
					if ( !number )
						number = getNumber( counts, 2 );
					counts[ number ] = true;
					options.banks[ number ] = compile3D( '3D', file.path, number, file.name, options, baseOptions );
					done = true;
				}
				else if ( file.name.indexOf( 'icons' ) == pos )
				{
					if ( !iconsDone )
					{
						number = 6;
						counts[ number ] = true;
						messages.print( messages.VERBOSE_DEV1, 'compiling_icons' );
						var name = file.name;
						if ( name.indexOf( '2.' ) == 0 )
							name = '6.' + name.substring( 2 );
						options.banks[ number ] = compileImages( 'icons', file.path, number, name, options, baseOptions );
						iconsDone = true;
					}
					done = true;
				}
				else if ( file.name.indexOf( 'samples' ) == pos || file.name.indexOf( 'sounds' ) == pos )
				{
					if ( !number )
						number = getNumber( counts, 5 );
					counts[ number ] = true;
					messages.print( messages.VERBOSE_DEV1, 'compiling_sounds' );
					options.banks[ number ] = compileSounds( 'samples', file.path, number, file.name, options, baseOptions );
					done = true;
				}
				else if ( file.name.indexOf( 'musics' ) == pos )
				{
					if ( !number )
						number = getNumber( counts, 3 );
					counts[ number ] = true;
					messages.print( messages.VERBOSE_DEV1, 'compiling_musics' );
					options.banks[ number ] = compileSounds( 'musics', file.path, number, file.name, options, baseOptions );
					done = true;
				}
				else if ( file.name.indexOf( 'pacpic' ) == pos )
				{
					if ( !number )
						number = getNumber( counts );
					counts[ number ] = true;
					options.banks[ number ] = compileBank( 'pacpic', file.path, number, file.name );
					done = true;
				}
				else if ( file.name.indexOf( 'tracker' ) == pos )
				{
					if ( !number )
						number = getNumber( counts );
					counts[ number ] = true;
					options.banks[ number ] = compileBank( 'tracker', file.path, number, file.name );
					done = true;
				}
				else if ( file.name.indexOf( 'data' ) == pos )
				{
					if ( !number ) 
						number = getNumber( counts );
					counts[ number ] = true;
					options.banks[ number ] = compileBank( 'data', file.path, number, file.name );
					done = true;
				}
				if ( !done )
				{
					// Just a folder-> copy all
					if ( file.name != 'filesystem' )
					{
						var destPath = options.destinationPath + '/resources/' + file.name;
						options.fileSaver.createDirectories( destPath );
						options.fileSaver.copyDirectory( destPath, file.path, { fileLoader: options.fileLoader, recursive: true } );

						if ( !number ) 
							number = getNumber( counts );
						counts[ number ] = true;
						options.banks[ number ] = { type: '__assets__', path: destPath, code: '', name: file.name };
					}
				}
			}
			else
			{
				if ( file.name.toLowerCase() != 'manifest.hjson' )
					messages.pushError( { compilerWarning: 'garbage_found_in_folder', parameter: file.path } );
			}
		}
	}
	return;

	function getNumber( counts, wantedNumber )
	{
		if ( wantedNumber )
		{
			if ( !counts[ wantedNumber ] )
			{
				counts[ wantedNumber ] = true;
				return wantedNumber;
			}
		}
		for ( var c = 6; ; c++ )
		{
			if ( !counts[ c ] )
				break;
		}
		counts[ c ] = true;
		return c;
	};
	function compileBank( bankType, bankPath, bankNumber, bankName )
	{
		var code = '';
		var copyList = [];
		var codeDone = false;
		var files = options.fileLoader.findDirectoryFiles( bankPath, { recursive: false } );
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
			{
				// Add element to copy list
				var destPath = options.destinationPath + '/resources/' + bankName + '/' + file.name;
				copyList.push( { source: file.path, destination: destPath } );

				// Generate code
				if ( codeDone )
					code += ',';
				else
					codeDone = true;
				var subPath = '';
				if ( options.isExtension )
					subPath = options.extensionName + '/';
				code += '{a:"' + subPath + utilities.getFilename( file.name ) + '.js",b:"' + file.name + '"}';
			}
		}
		if ( copyList.length > 0 )
		{
			var destPath = options.objPath + '/resources/' + bankName;
			options.fileSaver.createDirectories( destPath );
			options.fileSaver.equateFolderToList( destPath, copyList, { fileLoader: options.fileLoader, unlock: true, recursive: false } );
		}
		if ( options.noBanks[ bankType.toLowerCase() ] )
			code = '';
		return { type: bankType, copyList: copyList, code: code, name: bankName, path: options.moduleName ? options.moduleName + '/' + bankName : bankName };
	}
};
module.exports.compileBanks = compileBanks;


function compileImages( bankType, bankPath, bankNumber, bankName, options, baseOptions )
{
	var copyList = [];
	var code = '';
	var types = '';
	var codeDone = false;

	// Create directory if does not exist
	if ( !fs.existsSync( bankPath ) )
	{
		messages.pushError( { compilerWarning: 'creating_directory', parameter: bankPath }, false );
		options.fileSaver.createDirectories( bankPath );
	}

	// Scan files...
	var files = options.fileLoader.findDirectoryFiles( bankPath, { filters: [ '*.svg', '*.png', '*.jpg' ], recursive: false } );
	if ( files && files.length )
	{
		// utilities.createDirectories( options.destinationPath + '/resources/' + bankType );
		compileBank( files );
	}
	if ( options.noBanks[ bankType.toLowerCase() ] )
	{
		code = '';
		types = '';
	}
	// If main code or an extension WITH images...
	var pCode = '';
	var palette, hotSpots = '', alpha, masks = '';
	if ( !options.isExtension || code != '' )
	{
		// Palette
		palette = utilities.getManifestProperty( "default.screen.palette", options, baseOptions );
		var info = options.fileLoader.loadIfExist( bankPath + '/info.json', { encoding: 'utf8' } );
		if ( info )
		{
			try
			{
				info = JSON.parse( info.data );
			}
			catch( e )
			{
				messages.pushError( { compilerError: 'cannot_load_file', parameter: bankPath + '/palette.json' } );
			}
		}
		if ( info )
		{
			if ( info.palette )
			{
				for ( var c = 0; c < info.palette.length; c++ )
					palette[ c ] = info.palette[ c ];
			}
			if ( info.hotSpots )
			{
				for ( var c = 0; c < info.hotSpots.length; c++ )			
					hotSpots += '{ x: ' + info.hotSpots[ c ].x + ', y: ' + info.hotSpots[ c ].y + '},';
			}
			if ( info.masks )
			{
				masks = info.masks;
			}
			alpha = info.alpha;
		}
		if ( !hotSpots )
		{
			for ( var c = 0; c < copyList.length; c++ )
				hotSpots += "{ x: 0, y: 0 },";
			alpha = false;
		}
		
		if( palette ) // This IF to fix the 'length' error by the Transpiler.
		{
			for ( var p = 0; p < palette.length; p++ )
			{
				var color = palette[ p ].toString( 16 );
				pCode += '"' + color + '"';
				if ( p < palette.length - 1 )
					pCode += ',';
			}
		}
	}
	if ( copyList.length > 0 )
	{
		var destPath = options.objPath + '/resources/' + bankName;
		options.fileSaver.createDirectories( destPath );
		options.fileSaver.equateFolderToList( destPath, copyList, { fileLoader: options.fileLoader, unlock: true, recursive: false } );
	}
	return { type: bankType, copyList: copyList, code: code, types: types, palette: pCode, hotSpots: hotSpots, alpha: alpha, masks: masks, name: bankName, path: options.moduleName ? options.moduleName + '/' + bankName : bankName };

	function compileBank( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
			{
				// Add image to copy list
				copyList.push( { source: file.path, destination: options.destinationPath + '/resources/' + bankName + '/' + file.name } );

				// Generate code
				if ( codeDone )
				{
					code += ',';
					types += ',';
				}
				else
					codeDone = true;
				var subPath = '';
				if ( options.isExtension )
					subPath = options.extensionName + '/';
				code += '"' + subPath + utilities.getFilename( file.name ) + '.js"';

				var type;
				var extension = utilities.getFileExtension( file.name ).toLowerCase();
				switch ( extension )
				{
					case 'gif':
						type = 'image/gif';
						break;
					case 'jpg':
					case 'jpeg':
						type = 'image/jpeg';
						break;
					case 'svg':
						type = 'image/svg+xml';
						break;
					default:
					case 'png':
						type = 'image/png';
						break;
				}
				types += '"' + type + '"';
			}
		}
	}
};
module.exports.compileImages = compileImages;

function compile3D( bankType, bankPath, bankNumber, bankName, options, baseOptions )
{
	var copyList = [];
	var code = '';
	var types = '';
	var codeDone = false;

	// Create directory if does not exist
	if ( !fs.existsSync( bankPath ) )
	{
		messages.pushError( { compilerWarning: 'creating_directory', parameter: bankPath }, false );
		options.fileSaver.createDirectories( bankPath );
	}

	// Scan files...
	var files = options.fileLoader.findDirectoryFiles( bankPath, { filters: [ '*.*' ], recursive: false } );
	if ( files && files.length )
	{
		// utilities.createDirectories( options.destinationPath + '/resources/' + bankType );
		compileBank( files );
	}
	if ( options.noBanks[ bankType.toLowerCase() ] )
	{
		code = '';
		types = '';
	}

	// If main code or an extension ...
	var pCode = '';
	if ( !options.isExtension || code != '' )
	{
	}
	if ( copyList.length > 0 )
	{
		var destPath = options.objPath + '/resources/' + bankName;
		options.fileSaver.createDirectories( destPath );
		options.fileSaver.equateFolderToList( destPath, copyList, { fileLoader: options.fileLoader, unlock: false, recursive: false } );
	}
	return { type: bankType, copyList: copyList, code: code, types: types, name: bankName, path: options.moduleName ? options.moduleName + '/' + bankName : bankName };

	function compileBank( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
			{
				// Add image to copy list
				copyList.push( { source: file.path, destination: options.destinationPath + '/resources/' + bankName + '/' + file.name } );

				// Generate code
				if ( codeDone )
				{
					code += ',';
					types += ',';
				}
				else
					codeDone = true;
				var subPath = '';
				if ( options.isExtension )
					subPath = options.extensionName + '/';
				code += '"' + subPath + file.name + '"';

				var type = utilities.getFileExtension( file.name ).toLowerCase();
				types += '"' + type + '"';
			}
		}
	}
};
module.exports.compile3D = compile3D;

// TODO-> force load of sound module if sounds are present!
function compileSounds( bankType, bankPath, bankNumber, bankName, options, baseOptions )
{
	var copyList = [];
	var code = '';
	var soundTypes = '';
	var codeDone = false;
	var soundTypesDone = false;
	var name = bankPath.substring( bankPath.lastIndexOf( '.' ) );

	// Create directory if does not exist
	if ( !fs.existsSync( bankPath ) )
	{
		messages.pushError( { compilerWarning: 'creating_directory', parameter: bankPath }, false );
		options.fileSaver.createDirectories( bankPath );
	}

	// Scan files
	var files;
	if ( bankType == 'samples' )
		files = options.fileLoader.findDirectoryFiles( bankPath, { filters: [ '*.mp3', '*.wav', '*.ogg', '*.oga', '*.weba' ], recursive: false } );
	else
		files = options.fileLoader.findDirectoryFiles( bankPath, { filters: [ '*.mid', '*.midi' ], recursive: false } );

	if ( files && files.length )
	{
		compileBank( files );
	}
	if (  options.noBanks[ bankType.toLowerCase() ] )
	{
		code = '';
		soundTypes = '';
	}

	// Copy files
	if ( copyList.length > 0 )
	{
		var destPath = options.objPath + '/resources/' + bankName;
		options.fileSaver.createDirectories( destPath );
		options.fileSaver.equateFolderToList( destPath, copyList, { fileLoader: options.fileLoader, unlock: true, recursive: false } );
	}
	return { type: bankType, copyList: copyList, code: code, types: soundTypes, name: bankName, path: options.moduleName ? options.moduleName + '/' + bankName : bankName };

	function compileBank( files )
	{
		for ( var f = 0; f < files.length; f++ )
		{
			var file = files[ f ];
			if ( !file.isDirectory )
			{
				// Add image to copy list
				copyList.push( { source: file.path, destination: options.destinationPath + '/resources/' + bankName + '/' + file.name } );

				// Generate code
				if ( codeDone )
					code += ',';
				else
					codeDone = true;
				var subPath = '';
				//if ( options.isExtension )
				//	subPath = options.extensionName + '/';
				code += '{a:"' + subPath + utilities.getFilename( file.name ) + '.js",b:"' + file.name + '"}';

				// Get MIME type
				var extension = utilities.getFileExtension( file.name );
				var type;
				switch ( extension )
				{
					case 'mp3':
						type = 'audio/mp3';
						break;
					case 'oga':
					case 'ogg':
						type = 'audio/ogg';
						break;
					case 'weba':
						type = 'audio/weba';
						break;
					case 'aac':
						type = 'audio/aac';
						break;
					case 'mid':
					case 'midi':
						type = 'audio/midi';
						break;
					// case 'wav':
					default:
						type = 'audio/wav';
						break;
				}
				if ( soundTypesDone )
					soundTypes += ',';
				else
					soundTypesDone = true;
				soundTypes += '"' + type + '"';
			}
		}
	}
};
module.exports.compileSounds = compileSounds;

function compileFonts( options, textWindowFont, baseOptions )
{
	var googleDone = false;
	var googleFontsCode = '';
	var googleFontsFamilies = '';
	var googleFontsFaces = '';
	var amigaFontsCode = '';
	var amigaFontsFolder = [];

	// Google fonts
	var name;
	var fontList = '';
	options.fileSaver.createDirectories( options.destinationPath + '/resources/fonts' );
	options.fileSaver.createDirectories( options.destinationPath + '/resources/fonts/google' );
	if ( options.manifest.fonts && options.manifest.fonts.google )
	{
		for ( var f = 0; f < options.manifest.fonts.google.length; f++ )
		{
			name = options.manifest.fonts.google[ f ];
			addGoogleFont( name );
		}
	}
	options.fonts.googleList += fontList;

	// Amiga fonts
	var fontList = '';
	options.fileSaver.createDirectories( options.destinationPath + '/resources/fonts/amiga' );
	if ( options.manifest.fonts && options.manifest.fonts.amiga )
	{
		for ( var f = 0; f < options.manifest.fonts.amiga.length; f++ )
		{
			name = options.manifest.fonts.amiga[ f ];
			addAmigaFont( name );
		}
	}
	options.fonts.amigaList += fontList;

	// Text window font
	if ( textWindowFont )
	{
		if ( textWindowFont.type == 'google' )
		{
			if ( !googleFontsDone[ textWindowFont.name.toLowerCase() ] )
			{
				addGoogleFont( textWindowFont.name );
			}
		}
		else if ( textWindowFont.type == 'amiga' )
		{
			if ( !amigaFontsDone[ textWindowFont.name ] )
			{
				addAmigaFont( textWindowFont.name.toLowerCase() );
			}
		}
	}
	options.fonts.google += googleFontsCode;
	options.fonts.amiga += amigaFontsCode;
	options.fonts.families += googleFontsFamilies;
	options.fonts.faces += googleFontsFaces;

	options.fileSaver.cleanDirectory( options.destinationPath + '/resources/fonts/amiga', amigaFontsFolder, { fileLoader: options.fileLoader_fonts } );
	return;

	function addGoogleFont( fontName )
	{
		var fontPath = options.fontPath + '/google/' + fontName.toLowerCase();
		if ( !fs.existsSync( fontPath ) )
			messages.pushError( { compilerWarning: 'font_not_found', parameter: fontName }, false );
		else
		{
			if ( !googleFontsDone[ fontName.toLowerCase() ] )
			{
				var definition = options.fileLoader_fonts.getFile( fontPath + '/font.definition' );
				var info = importGoogleFont( definition, options );

				googleFontsCode += info.code;
				if ( googleDone )
					googleFontsFamilies += '|';
				else
					googleDone = true;
				googleFontsFamilies += info.name;
				googleFontsFaces += info.faces;

				// Clean the Google font folder
				var list = options.manifest.fonts.include ? options.manifest.fonts.include : [ '*.woff', '*.woff2' ];
				var opts = { filters: list, fileLoader: options.fileLoader_fonts };
				options.fileSaver.copyDirectory( options.destinationPath + '/resources/fonts/google', fontPath, opts );

				// One more font!
				googleFontsDone[ info.name.toLowerCase() ] = true;
			}
			else
			{
				messages.pushError( { compilerError: 'font_already_added', parameter: fontName }, false );
			}
			fontList += '"' + name + '",';
		}
	}
	function addAmigaFont( fontName, fontType )
	{
		var fontPath = options.fontPath + '/amiga/' + fontName;
		if ( !fs.existsSync( fontPath ) )
			messages.pushError( { compilerWarning: 'font_not_found', parameter: fontName }, false );
		else
		{
			var sizes = options.fileLoader_fonts.findDirectoryFiles( fontPath, { } );
			if ( sizes )
			{
				if ( !amigaFontsDone[ fontName.toLowerCase() ] )
				{
					amigaFontsCode += 'AmigaFonts["' + fontName + '"]=\n{\n';
					var charactersCode = 'AmigaCharacters["' + fontName + '"]=\n{\n';
					for ( var s = 0; s < sizes.length; s++ )
					{
						if ( utilities.getFileExtension( sizes[ s ].path ) == '' )
						{
							var fontSize = parseInt( sizes[ s ].name );
							if ( !isNaN( fontSize ) && fontSize > 0 )
							{
								var result = convertAmigaFont( fontName, fontSize );
								if ( result )
								{
									amigaFontsCode += result.main;
									charactersCode += result.characters;
									if ( s < sizes.length - 1 )
									{
										charactersCode += ',';
										amigaFontsCode += ',';
									}
									charactersCode += '\n';
									amigaFontsCode += '\n';
								}
							}
						}
						else
						{
							messages.pushError( { compilerWarning: 'garbage_found_in_folder', parameter: fontPath }, false );
						}
					}
					amigaFontsCode += '};\n';
					charactersCode += '};\n';

					// Save the file
					var jsCode = utilities.loadFile( options.templatesPath + '/amiga font/amigaFont.js', { encoding: 'utf8' } );
					jsCode = utilities.replaceStringInText( jsCode, 'INSERT_CHARACTERS', charactersCode );
					var savePath = options.destinationPath + '/resources/fonts/amiga/' + fontName + '.js';
					options.fileSaver.saveUTF8( savePath, jsCode, {} );
					amigaFontsFolder.push( savePath );

					// One more font!
					amigaFontsDone[ fontName.toLowerCase() ] = true;
				}
				fontList += '"' + fontName + '",';
			}
		}
	}
	function convertAmigaFont( fontName, fontSize )
	{
		// Load the font
		var buffer = options.fileLoader_fonts.getFile( options.fontPath + '/amiga/' + fontName + '/' + fontSize, { encoding: 'arraybuffer' } );
		var memoryBlock = new utilities.MemoryBlock( buffer, 'big' );

		var font = 36;

		// Skip the whole DiskFontHeader
		font += 4;	// dfh_TF.ln_Succ
		font += 4;	// dfh_TF.ln_Pred
		font += 1;	// dfh_TF.ln_Type
		font += 1;	// dfh_TF.ln_Pri
		font += 4;	// dfh_TF.ln_Name
		font += 2;	// dfh_FileID
		font += 2;	// dfh_Revision
		font += 4;	// dfh_Segment
		font += 32;	// MAXFONTNAME;

		// dfh_TF starts 
		font += 8;

		// skip type and pri
		var type = memoryBlock.peek( font ); font += 1;
		if ( type != 12 )
		{
			messages.pushError( { compilerWarning: 'font_not_supported', parameter: fontName } );
			return '';
		}
		font += 1;

		// Skip name pointer, replyport and msg length 
		font += 10;

		var height = memoryBlock.deek( font ); font += 2;			// tf_YSize
		var style = memoryBlock.peek( font ); font += 1;			// tf_Style
    	var flags = memoryBlock.peek( font ); font += 1;			// tf_Flags
    	var widthFont = memoryBlock.deek( font ); font += 2;		// tf_XSize
    	var baseLine = memoryBlock.deek( font ) + 1; font += 2;			// tf_Baseline
    	var boldSmear = memoryBlock.deek( font ); font += 2;		// tf_BoldSmear
    	var accessors = memoryBlock.deek( font ); font += 2;		// tf_Accessors
    	var loChar = memoryBlock.peek( font ); font += 1;			// tf_LoChar
    	var hiChar = memoryBlock.peek( font ) + 1; font += 1;			// tf_HiChar
    	var charData = memoryBlock.leek( font ) + 32; font += 4;	// tf_CharData
    	var modulo = memoryBlock.deek( font ); font += 2;			// tf_Modulo
		var charLoc = memoryBlock.leek( font ) + 32; font += 4;		// tf_CharLoc
		var charSpace = memoryBlock.leek( font ) == 0 ? 0 : memoryBlock.leek( font ) + 32;
		font += 4;
		var charKern = memoryBlock.leek( font ) == 0 ? 0 : memoryBlock.leek( font ) + 32;
		font += 4;
		if ( ( style & ( 1 << 6 ) ) != 0 )
		{
			messages.pushError( { compilerWarning: 'font_not_supported', parameter: fontName } );
			return '';
		}
		var mainCode = '\t' + height + ':{\n';
		mainCode += '\t\twidth:' + widthFont + ',\n';
		mainCode += '\t\theight:' + height + ',\n';
		mainCode += '\t\tstyle:' + style + ',\n';
		mainCode += '\t\tflags:' + flags + ',\n';
		mainCode += '\t\tbaseLine:' + baseLine + ',\n';
		mainCode += '\t\tboldSmear:' + boldSmear + ',\n';
		mainCode += '\t\taccessors:' + accessors + ',\n';
		mainCode += '\t\tloChar:' + loChar + ',\n';
		mainCode += '\t\thiChar:' + hiChar + '\n';
		mainCode += '\t}';

		// The bitmaps
		var code = '\t' + height + ':\n\t[\n';
		for ( var character = 0; character < hiChar - loChar; character++ )
		{
			code += '\t\t{' + '\t\t\t\t\t\t\t\t\t\t\t\t\t\t// "';
			if ( character + loChar >= 32)
				code += String.fromCharCode( character + loChar );
			else
				code += 'ascii:' + character + loChar;
			code += '"\n';
			var bitStart = memoryBlock.deek( charLoc + character * 4 );
			var width = memoryBlock.deek( charLoc + character * 4 + 2 );
			var space = charSpace == 0 ? width : memoryBlock.deek( charSpace + character * 2, true );
			var kern = charKern == 0 ? 0 : memoryBlock.deek( charKern + character * 2, true );
			if ( width > 256 || space > 256 || space < -256 || kern > 256 || kern < -256 )
			{
				messages.pushError( { compilerWarning: 'font_not_supported', parameter: fontName } );
				return;
			}
			code += '\t\t\twidth:' + width + ',\n';
			code += '\t\t\tspace:' + space + ',\n';
			code += '\t\t\tkern:' + kern + ',\n';
			code += '\t\t\tcode:' + ( character + loChar ) + ',\n';
			code += '\t\t\tbitmap:\n\t\t\t[\n'
			if ( width == 0 )
			{
				for ( var line = 0; line < height; line++ )
				{
					code += '\t\t\t\t0';
					if ( line < height - 1 )
						code += ',';
					code += '\n'
				}
			}
			else
			{
				var address1 = charData + Math.floor( bitStart / 8 );
				for ( var line = 0; line < height; line++ )
				{
					code += '\t\t\t\t';

					var address2 = address1;
					var mask = 0x80 >> ( bitStart & 7 );
					var byte = memoryBlock.peek( address2++ );
					var destination = '';
					destinationCount = 0;
					code += '0b';
					for ( var w = 0; w < width; w++ )
					{
						if ( ( byte & mask ) != 0 )
							destination += '1';
						else
							destination += '0';
						if ( mask == 1 )
						{
							byte = memoryBlock.peek( address2++ );
							mask = 0x80;
						}
						else
						{
							mask >>= 1;
						}
						destinationCount++;
						if ( destinationCount == 8 )
						{
							code += destination;
							destination = '';
							destinationCount = 0;
							if ( w < width - 1 )
								code += ',0b';
						}
					}
					if ( destinationCount )
					{
						while ( destination.length < 8 )
							destination += '0';
						code += destination;
					}
					if ( line < height - 1 )
						code += ',';
					code += '\n';
					address1 += modulo;
				}
			}
			code += '\t\t\t]\n';
			code += '\t\t}';
			if ( character < hiChar - loChar - 1 )
				code += ',';
			code += '\n';
		}
		code += '\t]';

		// Finished!
		return { main: mainCode, characters: code };
	};
};
module.exports.compileFonts = compileFonts;

function importGoogleFont( definition, options )
{
	function getCSSValue( tag, text, start, end )
	{
		position = text.indexOf( tag, start );
		if ( position >= 0 )
		{
			position += tag.length;
			var semiColon = text.indexOf( ';', position );
			if ( semiColon >= 0 && semiColon < end )
			{
				var result = text.substring( position, semiColon );
				return utilities.trimString( result );
			}
		}
		return false;
	};
	function getLine( text, name, number, start, end )
	{
		var position = text.indexOf( name, start );
		while( number-- > 0 && position >= 0 )
			position = text.indexOf( name, position + name.length );
		if ( position >= 0 )
		{
			var s = text.lastIndexOf( '\n', position ) + 1;
			var e = text.indexOf( '\n', position ) + 1;
			return text.substring( s, e );
		}
		return undefined;
	}
	function getLineComma( text, name, number, start, end )
	{
		text = getLine( text, name, number, start, end );
		if ( text )
			text = utilities.replaceStringInText( text, '),', ');' );
		return text;
	}

	var name = getCSSValue( 'font-family:', definition, 0, definition.length );
	name = name.substring( 1, name.length - 1 );
	var googleFontsCode = 'GoogleFonts["' + name.toLowerCase() + '"]=\n{\n\t';

	def = definition;
	if ( definition.indexOf( 'FONT_FACE' ) >= 0 )
		def = utilities.extractCode( definition, 'FONT_FACE' );
	var newDef = '';
	var done = false;
	var start = def.indexOf( '@font-face' );
	var family = false;
	var list = options.manifest.fonts.include ? options.manifest.fonts.include : [ '*.woff', '*.woff2' ];
	while ( start >= 0 )
	{
		var newDefSrc = [];

		var end = def.indexOf( '}', start );
		newDef += '@font-face {\n';
		if ( !family )
		{
			family = getCSSValue( 'font-family:', def, start, end );
			var fName = family.substring( 1, family.length - 1 );
			googleFontsCode += 'name:"' + fName + '",sizes:[';
		}
		newDef += "  font-family: '" + fName + "';\n";
		var style = getCSSValue( 'font-style:', def, start, end );
		var weight = getCSSValue( 'font-weight:', def, start, end );
		newDef += "  font-style: " + style + ";\n";
		newDef += "  font-weight: " + weight + ";\n";
		if ( done )
			googleFontsCode += ',';
		else
			done = true;
		googleFontsCode += '{weight:"' + weight + '",style:"' + style + '"}';

		var line = getLine( def, 'local(', 0, start, end );
		if ( line )
			newDefSrc.push( line );
		else
			newDefSrc.push( "  src: local(''),\n" );
		for ( var fn = 0; fn < list.length; fn++ )
		{
			var fnName = list[ fn ].substring( 2 );
			if ( fnName == 'eot' )
			{
				var line = getLineComma( def, "." + fnName + "')", 0, start, end );
				if ( line )
					newDef += line;
			}
			var sName = fnName;
			if ( sName == 'ttf' )
				sName = 'truetype'
			else if ( sName == 'eot' )
				sName = 'embedded-opentype';
			line = getLineComma( def, "'" + sName + "'", 0, start, end );
			if ( line )
				newDefSrc.push( line );				
		}
		var l;
		newDef += newDefSrc[ 0 ];
		for ( l = 1; l < newDefSrc.length - 1; l++ )
		{
			var line = utilities.replaceStringInText( newDefSrc[ l ], ');', '),' );
			newDef += line;
		}
		newDef += newDefSrc[ l ] + '}\n';

		start = def.indexOf( '@font-face', end );
	};
	googleFontsCode += ']\n};\n';
	def = utilities.replaceStringInText( newDef, '../fonts/', './resources/fonts/google/' );

	return {
		name: name,
		faces: def,
		code: googleFontsCode,
		families: name
	};
};
module.exports.importGoogleFont = importGoogleFont;

// Finish the fonts code
function finishFonts( options )
{
};
module.exports.finishFonts = finishFonts;

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
 * Import of old A.M.O.S applications
 *
 * @author FL (Francois Lionet)
 * @date first push on 22/12/2018
 */
var HJSON = require( 'hjson' );
var PATH = require( 'path' );
var TMP = require( 'tmp' );
var EXEC = require('child_process');
var FS = require( 'fs' );
var MKDIRP = require( 'mkdirp' );
var DATEANDTIME = require( 'date-and-time' );

var messages = require( './messages' );
var utilities = require( './utilities' );
var compiler = require( './compiler' );
var banks = require( './banks' );
var filesystem = require( './filesystem' );
var us = require( './en' ) ;

function convertAMOS( destinationPath, sourcePath, options, callback, extra )
{
	destinationPath = PATH.normalize( destinationPath );
	sourcePath = PATH.normalize( sourcePath );
	try
	{
		// Title
		messages.print( messages.VERBOSE_MESSAGES, 'converting', [ sourcePath, destinationPath ] );

		// Delete directory if it exists
		if ( FS.existsSync( destinationPath ) )
		{
			utilities.deleteDirectory( destinationPath, { recursive: true } );
		}

		// Make the directory structure
		var done = {};
		MKDIRP.sync( destinationPath );
		MKDIRP.sync( destinationPath + '/resources/filesystem/application' );
		MKDIRP.sync( destinationPath + '/resources/1.images' );
		MKDIRP.sync( destinationPath + '/resources/6.icons' );
		MKDIRP.sync( destinationPath + '/resources/3.musics' )
		MKDIRP.sync( destinationPath + '/resources/5.samples' );

		var fileSaver = new utilities.FileSaver( destinationPath, '', { version: options.version, dataPath: options.dataPath, recursive: true, loadFiles: true } );

		// Save the code of the application
		messages.print( messages.VERBOSE_MESSAGES, 'converting_code' );
		var command = '"' + options.utilitiesPath + '/listamos.exe" "' + sourcePath + '"';
		if( process.platform == 'darwin' )
		{
			command = '"' + options.utilitiesPath + '/listamos.app" "' + sourcePath + '"';
		}

		var source = EXEC.execSync( command, { } ).toString();		
		var header = messages.getMessage( 'conversion_header', [ utilities.getFilenameAndExtension( sourcePath ), utilities.getFormattedDate() ] );
		fileSaver.saveUTF8( destinationPath + '/main.aoz', header + source );

		// TEMPORARY-> save the images
		var tempPath = TMP.dirSync().name;
		var command = '"' + options.utilitiesPath + '/dumpamos.exe" "' + sourcePath + '"';
		FS.writeFileSync( 'command2.log', command );
		if( process.platform == 'darwin' )
		{
			command = '"' + options.utilitiesPath + '/dumpamos.app" "' + sourcePath + '"';
		}

		//console.log( command );
		stdout = EXEC.execSync( command, { cwd: tempPath } ).toString();;

		// Converts the banks
		messages.print( messages.VERBOSE_MESSAGES, 'converting_banks' );
		var buffer = utilities.loadFile( sourcePath, { encoding: 'arraybuffer' } );
		var block_amos = new utilities.MemoryBlock( buffer, 'big' );
		var banks = convert_amos( utilities.getFilename( sourcePath ), block_amos, { convert: false } );

		// Copy files...
		var counts =
		{
			images: 0,
			icons: 0,
			samples: 0,
			musics: 0,
			img: 0,
			tracker: 0,
			data: 0
		};
		for ( var b in banks )
		{
			var bank = banks[ b ];
			done[ b ]= true;
			switch ( bank.type )
			{
				case 'icons':
					var type = bank.type;
					path = destinationPath + '/resources/' + 6 + '.' + type;
					fileSaver.createDirectories( path );
					var hotSpots = [];
					for ( var i = 0; i < bank.data.length; i++ )
					{
						counts[ 'icons' ]++;
						hotSpots[ i ] = bank.data[ i ].hotSpot;

						// Temporary-> convert to PNG
						var num = (i + 1).toString( 16 );
						if ( num.length < 2 )
							num = '0' + num;
						var imageName = tempPath + '\\icon' + num + '.iff';
						var command = '"' + options.utilitiesPath + '/Nuclex.ImageConverter" "' + imageName + '" "' + path + '/' + ( i + 1 ) + '.png"';
						stdout = EXEC.execSync( command, { cwd: path } ).toString();
					}
					// Save palette and hotspots
					var info = 
					{
						palette: bank.data[ 0 ].palette,
						hotSpots: hotSpots,
						alpha: false
					};
					var json = JSON.stringify( info );
					fileSaver.saveUTF8( path + '/info.json', json );
					break;
				case 'images':
					var type = bank.type;
					path = destinationPath + '/resources/' + bank.number + '.' + type;
					fileSaver.createDirectories( path );
					var hotSpots = [];
					for ( var i = 0; i < bank.data.length; i++ )
					{
						counts[ 'images' ]++;
						hotSpots[ i ] = bank.data[ i ].hotSpot;

						// Temporary-> convert to PNG
						var num = (i + 1).toString( 16 );
						if ( num.length < 2 )
							num = '0' + num;
						var imageName = tempPath + '\\sprite' + num + '.iff';
						var imageDestPath = path + '/' + ( i + 1 ) + '.png';
						var command = '"' + options.utilitiesPath + '/Nuclex.ImageConverter" "' + imageName + '" "' + imageDestPath;
						stdout = EXEC.execSync( command, { cwd: path } ).toString();
					}
					// Save palette and hotspots
					var info = 
					{
						palette: bank.data[ 0 ].palette,
						hotSpots: hotSpots,
						alpha: false
					};
					var json = JSON.stringify( info );
					fileSaver.saveUTF8( path + '/info.json', json );
					break;
				case 'samples':
					// Save the samples as 8svx
					var path = destinationPath + '/resources/'  + bank.number + '.' + bank.type;
					fileSaver.createDirectories( path );
					for ( var i = 0; i < bank.data.length; i++ )
					{
						utilities.save( tempPath + '/sound.8svx', bank.data[ i ].bufferView );
						var command = '"' + options.utilitiesPath + '/sox/sox" "' + tempPath + '/sound.8svx' + '" "' + path + '/' + ( i + 1 ) + '.wav"';
						stdout = EXEC.execSync( command, { cwd: path } ).toString();
					}
					break;
				case 'pacpic':
					counts[ bank.type ]++;
					var path = destinationPath + '/resources/'  + bank.number + '.' + bank.type;
					fileSaver.createDirectrories( path );
					fileSaver.copyMemoryBlock( path + '/1.pac', bank.data );
					break;
				case 'tracker':
					counts[ bank.type ]++;
					var path = destinationPath + '/resources/'  + bank.number + '.' + bank.type;
					fileSaver.createDirectories( path );
					fileSaver.copyMemoryBlock( path + '/1.track', bank.data );
					break;
				case 'data':
					counts[ bank.type ]++;
					var path = destinationPath + '/resources/'  + bank.number + '.' + bank.type;
					fileSaver.createDirectories.sync( path );
					fileSaver.copyMemoryBlock( path + '/1.bin', bank.data );
					break;
				default:
					messages.pushError( { compilerError: 'unknown_bank_format', parameter: bank.type } );
					break
			}
		}

		// TEMPORARY-> Clear the temporary directory
		utilities.deleteDirectory( tempPath, { recursive: true, onlyFiles: false, onlyDirectories: false } );

		fileSaver.close();

		/*
		function saveBank( number, type )
		{
			number = '' + number;
			var bankPath = destinationPath + '/resources/' + type + number;
			MKDIRP.sync( bankPath );
			var filePath = bankPath + '/1.js';
			var data = utilities.loadFile( file.path, { encoding: 'arraybuffer' } );
			var text = utilities.convertArrayBufferToString( data );
			var source = 'window["bank_' + number + '"]={type:' + '"data", code:"' + text + '"};';
			fileSaver.saveUTF8( filePath, source, { encoding: 'utf8' } );
		}
		*/
	}
	catch ( error )
	{
		console.log( error );
		messages.pushError( { compilerError: 'conversion_error', parameter: options.sourcePath } );
		callback( false, {}, extra );
	}
	var banksNumber = 0;
	if( counts )
	{
		banksNumber = counts[ 'icons' ] ? 1 : 0 + counts[ 'musics' ] ? 1 : 0 + counts[ 'pacpic' ] + counts[ 'tracker' ] + counts[ 'data' ]
	}
	messages.print( messages.VERBOSE_MESSAGES, 'conversion_succesfull' );
	callback( true, {}, extra );
};
module.exports.convertAMOS = convertAMOS;


///////////////////////////////////////////////////////////////////////////////////
//
// Importation routines
//
///////////////////////////////////////////////////////////////////////////////////
var ID_AMOS = 0x414D4F53;
var ID_AmBs = 0x416D4273;
var ID_AmBk = 0x416D426B;
var ID_AmSp = 0x416D5370;
var ID_AmIc = 0x416D4963;

var IFF_ILBM_HEADER_LEN = 0xb0;
var iff_ilbm_header =
[
	'F', 'O', 'R', 'M',    	/* 00 FORM                        */
	0,   0,   0,   0,     	/* 04   form length               */
	'I', 'L', 'B', 'M',    	/* 08   ILBM                      */
	'B', 'M', 'H', 'D',    	/* 0c   BMHD                      */
	0,   0,   0,   20,    	/* 10     bmhd chunk length (20)  */
	0,   0,               	/* 14     width                   */
	0,   0,               	/* 16     height                  */
	0,   0,               	/* 18     x offset (0)            */
	0,   0,              	/* 1a     y offset (0)            */
	0,                    	/* 1c     number of bitplanes     */
	0,                    	/* 1d     masking (0)             */
	0,                    	/* 1e     compression (0)         */
	0,                    	/* 1e     reserved1 (0)           */
	0,   0,               	/* 20     transparent colour (0)  */
	1,                    	/* 22     x aspect (1)            */
	1,                    	/* 23     x aspect (1)            */
	0,   0,               	/* 24     page width              */
	0,   0,               	/* 26     page height             */
	'C', 'A', 'M', 'G',    	/* 28   CAMG                      */
	0,   0,   0,   4,     	/* 2c     camg chunk length (4)   */
	0,   0,   0,   0,     	/* 30     viewmode                */
	'G', 'R', 'A', 'B',    	/* 34   GRAB                      */
	0,   0,   0,   4,     	/* 38     grab chunk length (4)   */
	0,   0,               	/* 3C     x hotspot               */
	0,   0,               	/* 3E     y hotspot               */
	'C', 'M', 'A', 'P',    	/* 40   CMAP                      */
	0,   0,   0,   96    	/* 44     cmap chunk length (96)  */
							/* 48     {UBYTE r,g,b}[32]       */
							/* a8   BODY                      */
							/* ac     body chunk length       */
							/* b0     unpacked raw bitplanes  */
];

var IFF_8SVX_HEADER_LEN = 0x30;
var iff_8svx_header =
[
	'F', 'O', 'R', 'M',    	/* 00 FORM                        */
	0,   0,   0,   0,     	/* 04   form length               */
	'8', 'S', 'V', 'X',    	/* 08   8SVX                      */
	'V', 'H', 'D', 'R',    	/* 0c   VHDR                      */
	0,   0,   0,   20,    	/* 10     vhdr chunk length (20)  */
	0,   0,   0,   0,     	/* 14     one-shot length         */
	0,   0,   0,   0,     	/* 18     repeat length (0)       */
	0,   0,   0,   0,     	/* 1c     average rate (0)        */
	0,   0,               	/* 20     frequency in hz         */
	1,                    	/* 22     number of octaves (1)   */
	0,                   	/* 23     compression mode (0)    */
	0,   1,   0,   0,     	/* 24     volume (0x10000)        */
	'B', 'O', 'D', 'Y',    	/* 28   BODY                      */
	0,   0,   0,   0      	/* 2c     body length             */
							/* 30     raw sample data         */
];

function convert_amos( name, block, options )
{
	options = typeof options == 'undefined' ? { convert: true } : options;

	var result;
	if ( block.length < 4 )
	{
		messages.pushError( { compilerError: 'unknown_bank_format', parameter: '' } );
    }
	else
	{
		switch ( block.leek( 0 ) )
		{
        case ID_AMOS:
            result = convert_source( name, block, options );
            break;

        case ID_AmBs:
            result = convert_banks( name, block, options );
            break;

        case ID_AmBk:
        case ID_AmSp:
        case ID_AmIc:
            result = convert_bank( name, block, options );
            break;

        default:
			messages.pushError( { compilerError: 'unknown_bank_format', parameter: '' } );
			break;
        }
	}
	return result;
};

function convert_source( name, block, options )
{
	var result;
	options = typeof options == 'undefined' ? { convert: true } : options;
	if ( block.length < 30 )
	{
		messages.pushError( { compilerError: 'unknown_bank_format', parameter: '' } );
    }
	else
	{
        var src_len = block.leek( 16 ) + 20;
        var header = block.peek$( 0, 16 );

		if ( src_len < block.length )
		{
			var block_bank = new utilities.MemoryBlock( 2, 'big' );
			block_bank.setFromMemoryBlock( block, src_len );
			result = convert_banks( name, block_bank, options );
        }
	}
	return result;
}

function convert_banks( name, block, options )
{
	options = typeof options == 'undefined' ? { convert: true } : options;
	if ( block.length < 6)
	{
        messages.pushError( { compilerError: 'unknown_bank_format', parameter: '' } );
    }
	else
	{
		var count = 0;
		var result = {};
		var num_banks = block.deek( 4 );
		var bank_pos = 6;
		while ( num_banks-- )
		{
            var bank_len = get_bank_length( block, bank_pos );
            var bank_num = get_bank_number( block, bank_pos );
			var bank_type = get_bank_type( block, bank_pos );
			var block_bank = new utilities.MemoryBlock( 2, 'big' );
			block_bank.setFromMemoryBlock( block, bank_pos, bank_pos + bank_len );
			if ( bank_num > 0 )
			{
				var outname = "bank" + bank_num + ".abk";
				var bankResult = convert_bank( outname, block_bank, options );
				if ( bankResult )
					result[ count++ ] = bankResult;
            }
            bank_pos += bank_len;
        }
	}
	return result;
}

function convert_bank( name, block, options )
{
	options = typeof options == 'undefined' ? { convert: true } : options;
	var bank_length = get_bank_length( block );
	if ( !bank_length )
		return;
	var bank_num = get_bank_number( block );
	var id = block.leek( 0 );

	var result, type;
	switch ( id )
	{
		case ID_AmSp:
			type = 'images';
			result = convert_sprites( bank_num + '.' + 'sprites', block, options );
			break;
		case ID_AmIc:
			type = 'icons';
			result = convert_sprites( bank_num + '.' + 'icons', block, options );
			break;
		case ID_AmBk:
			{
				var id2 = block.peek$( 12, 8 );
				if ( id2 == "Pac.Pic." )
				{
					type = 'pacpic';
					result = convert_pacpic( bank_num + '.' + 'pacpic', block, options );
				}
				else if ( id2 == "Samples " )
				{
					type = 'samples';
					result = convert_samples( bank_num + '.' + 'samples', block, options );
				}
				else if ( id2 == "Tracker " )
				{
					type = 'tracker';
					result = convert_tracker( bank_num + '.' + 'tracker', block, options );
				}
				else
				{
					type = 'data';
					result = convert_data( bank_num + '.' + 'data', block, options );
				}
			}
			break;
		default:
			messages.pushError( { compilerError: 'unknown_bank_format', parameter: '' } );
			return;
	}
	return { type: type, number: bank_num, data: result };
};

function convert_sprites( name, block, options )
{
	options = typeof options == 'undefined' ? { convert: true } : options;
	var sprites = [];
	var num_sprites = block.deek( 4 );
	var sp = 6;
	var pal = block.length - 64;

	messages.print( messages.VERBOSE_MESSAGES, 'extracting_bank', [ name, num_sprites, 'images/icons', false ] );

	/* create an IFF ILBM file for each sprite/icon */
	for ( var i = 0; i < num_sprites; i++ )
	{
		var w, h, d, sp_len, ilbm_len, line, plane;
		var body;

		w = block.deek( sp + 0 ) * 2;
		h = block.deek( sp + 2 );
		d = block.deek( sp + 4 );

		sp_len = w * h * d;
		ilbm_len = IFF_ILBM_HEADER_LEN + sp_len;
		var ilbmBlock = new utilities.MemoryBlock( ilbm_len, 'big' );

		ilbmBlock.copyArray( 0, iff_ilbm_header, 'byte' );
		ilbmBlock.loke( 0x04, ilbm_len - 8 );
		ilbmBlock.doke( 0x14, w * 8 );  				/* width */
		ilbmBlock.doke( 0x16, h );      				/* height */
		ilbmBlock.poke( 0x1c, d & 0xFF );          		/* number of bitplanes */
		ilbmBlock.doke( 0x24, w * 8 );  				/* page width */
		ilbmBlock.doke( 0x26, h );      				/* page height */
		ilbmBlock.copyFrom( 0x3C, block, sp + 6, 4 ); 	/* x/y hotspot */
		ilbmBlock.poke$( 0xA8, "BODY" );
		ilbmBlock.loke( 0xAC, sp_len ); 				/* body length */

		/* convert palette from 0x0RGB to 0xRR 0xGG 0xBB */
		var palette = [];
		for ( var j = 0; j < 32; j++)
		{
			var c = block.deek( pal + j * 2 );
			var r = ((c >> 8) & 0xF) * 0x11;
			var g = ((c >> 4) & 0xF) * 0x11;
			var b = ((c     ) & 0xF) * 0x11;
			ilbmBlock.poke( 0x48 + ( j * 3 ) + 0, r );
			ilbmBlock.poke( 0x48 + ( j * 3 ) + 1, g );
			ilbmBlock.poke( 0x48 + ( j * 3 ) + 2, b );
			palette[ j ] = utilities.getRGBAString( r, g, b );
		}

		/* interleave the sprite data (all lines of plane 0, plane 1, ...)
			into ILBM format (line 0 plane 0, line 0 plane 1, ...) */
		var body = IFF_ILBM_HEADER_LEN;
		for ( var line = 0; line < h; line++ )
		{
			for ( var plane = 0; plane < d; plane++ )
			{
				ilbmBlock.copyFrom( body, block, sp + 10 + line * w + plane * w * h, w );
				body += w;
			}
		}

		// Convert to PNG
		if ( options.convert )
		{
			/*
			sprites[ i ] = IFF.loadIffBuffer( undefined, ilbmBlock.buffer );
			if ( sprites[ i ].width <= 0 || sprites[ i ].height <= 0 )
			{
				sprites[ i ].width = 8;
				sprites[ i ].height = 8;
			}
			var context = sprites[ i ].getContext( '2d' );
			utilities.remapBlock( context, [ { r: 0, g: 0, b: 0, a: 255 } ], [ { r: 0, g: 0, b: 0, a: 0 } ], { x: 0, y: 0, width: sprites[ i ].width, height: sprites[ i ].height } );
			*/
		}
		else
		{
			sprites[ i ] = { image: ilbmBlock, palette: palette, hotSpot: { x: block.deek( sp + 6 ), y: block.deek( sp + 8 ) } };
		}
		sp += 10 + sp_len;
	}
	return sprites;
}

function convert_pacpic( name, block, options )
{
	options = typeof options == 'undefined' ? { convert: true } : options;
	var end = block.length;
	var s, pal, picdata, rledata, points, ilbm;
	var i, j, k, l, bplcon0, width, ilbm_width, lumps,
		lump_height, ilbm_height, bitplanes, ilbm_len, ilbm_line,
		rledata_offset, points_offset;

	messages.print( messages.VERBOSE_MESSAGES, 'extracting_bank', [ name, block.length, 'packed picture', false ] );

	/* check if screen header present */
	if ( block.length < 24)
		return;
	i = block.leek( 20 );
	if ( block.length > 134 && (i == 0x12031990 || i == 0x00031990 || i == 0x12030090) )
	{
		bplcon0 = block.deek( 20 + 20 ); 		/* screen mode */
		pal = 20 + 26; 							/* palette */
		s = 110; 								/* picture header */
	}
	else if (block.length > 44 && (i == 0x06071963 || i == 0x06070063))
	{
		bplcon0 = block.deek( 20 + 14 ) << 12 | 0x200; 	/* guess BPLCON0 */
		pal = -1; 										/* no palette */
		s = 20; 										/* picture header */
	}
	else
	{
		messages.pushError( { compilerError: 'unknown_bank_format ', parameter: '' } );
		return;
	}

	width 				= block.deek( s + 8 );
	lumps            	= block.deek( s + 10 );
	lump_height      	= block.deek( s + 12 );
	bitplanes        	= block.deek( s + 14 );
	rledata_offset   	= block.leek( s + 16 );
	points_offset    	= block.leek( s + 20 );

	if (rledata_offset > ( block.length - s) || points_offset > (block.length - s))
	{
		return;
	}

	/* IFF ILBM requires an even width */
	ilbm_width = width;
	if (ilbm_width & 1)
		ilbm_width++;

	/* number of bytes jump to get to the next line in IFF */
	ilbm_line = ilbm_width * bitplanes;
	ilbm_height = lumps * lump_height;

	ilbm_len = IFF_ILBM_HEADER_LEN + ilbm_line * ilbm_height;
	var ilbmBlock = new utilities.MemoryBlock( ilbm_len, 'big' );

	var plane, rbit, rrbit, picbyte, rlebyte;

	ilbmBlock.copyArray( 0, iff_ilbm_header, 'byte' );
	ilbmBlock.loke( 0x04, ilbm_len - 8 );
	ilbmBlock.doke( 0x14, ilbm_width * 8 );  				/* width */
	ilbmBlock.doke( 0x16, ilbm_height );     				/* height */
	ilbmBlock.poke( 0x1c, bitplanes & 0xFF );          		 /* number of bitplanes */
	ilbmBlock.doke( 0x24, ilbm_width * 8 );		  			/* page width */
	ilbmBlock.doke( 0x26, ilbm_height );     				/* page height */
	ilbmBlock.loke( 0x30, bplcon0 );         				/* viewmode */
	ilbmBlock.poke$( 0xA8, "BODY" );
	ilbmBlock.loke( 0xAC, ilbm_len - IFF_ILBM_HEADER_LEN); 	/* body length */

	/* convert palette from 0x0RGB to 0xRR 0xGG 0xBB */
	for ( var i = 0; i < 32; i++)
	{
		var c = ( pal >= 0 ) ? block.deek( pal + i*2 ) : (i & 0x0F) * 0x111;
		ilbmBlock.poke( 0x48 + (i * 3) + 0, ((c >> 8) & 0xF) * 0x11 );
		ilbmBlock.poke( 0x48 + (i * 3) + 1, ((c >> 4) & 0xF) * 0x11 );
		ilbmBlock.poke( 0x48 + (i * 3) + 2, ((c     ) & 0xF) * 0x11 );
	}

	/* decrunch RLE streams */
	rbit = 7;
	rrbit = 6;
	picdata = s + 24;
	rledata = s + rledata_offset;
	points  = s + points_offset;
	picbyte = block.peek( picdata++ );
	rlebyte = block.peek( rledata++ );
	if ( block.peek( points ) & 0x80 )
		rlebyte = block.peek( rledata++ );
	plane = IFF_ILBM_HEADER_LEN;
	try
	{

		for (i = 0; i < bitplanes; i++)
		{
			var lump_start = plane;
			for (j = 0; j < lumps; j++)
			{
				var lump_offset = lump_start;
				for (k = 0; k < width; k++)
				{
					var d = lump_offset;
					for (l = 0; l < lump_height; l++)
					{
						/* if the current RLE bit is set to 1, read in a new picture byte */
						if (rlebyte & (1 << rbit--))
						{
							if ( picdata >= end)
							{
								throw 'out';
							}
							picbyte = block.peek( picdata++ );
						}

						/* write picture byte and move down by one line in the picture */
						ilbmBlock.poke( d, picbyte );
						d += ilbm_line;

						/* if we've run out of RLE bits, check the POINTS bits to see if
							* a new RLE byte is needed */
						if (rbit > 7)
						{
							rbit = 7;
							if ( block.peek( points ) & (1 << rrbit--) )
							{
								if (rledata >+ end)
								{
									throw 'out';
								}
								rlebyte = block.peek( rledata++ );
							}
							if (rrbit > 7)
							{
								rrbit = 7;
								points++;
								if (points > end)
								{
									throw 'out';
								}
							}
						}
					}
					lump_offset++;
				}
				lump_start += ilbm_line * lump_height;
			}
			plane += ilbm_width; /* ILBM interleaved bitplanes */
		}
	}
	catch( e )
	{
		var toto = 2;
	}
	/*if ( options.convert )
	{
		return IFF.loadIffBuffer( undefined, ilbmBlock.buffer );
	}
	*/
	return ilbmBlock;
};

function convert_samples( name, block, options )
{
	options = typeof options == 'undefined' ? {} : options;
	var samples = [];
	var num_samples;

	if (block.length < 22)
		return;
	num_samples = block.deek( 20 );
	if (block.length < 22 + (num_samples * 4))
		return;

	messages.print( messages.VERBOSE_MESSAGES, 'extracting_bank', [ name, num_samples, 'samples', false ] );

	/* create an IFF 8SVX file for each sample */
	for ( var i = 0; i < num_samples; i++)
	{
		var offset = block.leek( 22 + i * 4 ) + 20;
		var freq, sam_len, svx_len;

		if (offset > block.length)
			return;

		/* copy sample name, change non-alnum to "_" */
		name = block.peek$( offset, 6 );

		freq    = block.deek( offset + 8 );
		sam_len = block.leek( offset + 10 );

		if ((offset + 14 + sam_len) > block.length)
		{
			sam_len = (block.length - (offset + 14));
		}

		svx_len = IFF_8SVX_HEADER_LEN + sam_len;
		var svxBlock = new utilities.MemoryBlock(svx_len, 'big');

		svxBlock.copyArray(0, iff_8svx_header, 'byte');
		svxBlock.loke( 0x04, svx_len - 8);
		svxBlock.doke( 0x20, freq);
		svxBlock.loke( 0x2C, sam_len);
		svxBlock.copyFrom( 0x30, block, offset + 14, sam_len );

		if ( options.convert )
		{
			samples[ i ] = svxBlock;
		}
		else
		{
			samples[ i ] = svxBlock;
		}
	}
	return samples;
};

function convert_tracker( name, block, options )
{
	messages.print( messages.VERBOSE_MESSAGES, 'extracting_bank', [ name, block.length, 'tracker music', false ] );

	options = typeof options == 'undefined' ? { convert: true } : options;
	var mod_len = block.length - 20;
	var bank_block = new utilities.MemoryBlock( mod_len, 'big' );
	bank_block.copyFrom( 0, block, 20, mod_len );
	return bank_block;
}

function convert_data( name, block, options )
{
	messages.print( messages.VERBOSE_MESSAGES, 'extracting_bank', [ name, block.length, 'data', false ] );

	options = typeof options == 'undefined' ? { convert: true } : options;
	var bank_len = block.length - 20;
	var bank_block = new utilities.MemoryBlock( bank_len, 'big' );
	bank_block.copyFrom( 0, block, 20, bank_len );
	return bank_block;
}

function get_bank_length( block, offset )
{
	offset = typeof offset == 'undefined' ? 0 : offset;
	if ( block.length  >= 6 && ( block.leek( offset + 0 ) == ID_AmSp || block.leek(offset + 0 ) == ID_AmIc ) )
	{
		var num_sprites = block.deek( offset + 4 );
		var pos = 6, w, h, d;
		while ( num_sprites-- )
		{
			if ( pos + 10 > block.length )
				return 0;
			w = block.deek( offset + pos ) * 2;
			h = block.deek( offset + pos + 2 );
			d = block.deek(	offset + pos + 4 );
			pos += 10 +  w * h * d;
		}
		pos += 64; /* include palette */
		return pos > block.length ? 0 : pos;
	}
	else if ( block.length >= 20 && block.leek( offset + 0 ) == ID_AmBk )
	{
		var bank_len = ( block.leek( offset + 8 ) & 0x0FFFFFFF ) + 20 - 8;
		return bank_len > block.length ? 0 : bank_len;
	}
	return 0;
};

function get_bank_number( block, offset )
{
	offset = typeof offset == 'undefined' ? 0 : offset;
	if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmSp )
	{
		return 1; /* Sprites always bank 1 */
	}
	if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmIc )
	{
		return 2; /* Icons always bank 2 */
	}
	if ( block.length >= 20 && block.leek( offset + 0 ) == ID_AmBk)
	{
		return block.deek( 4 );
	}
	return 0;
};

function get_bank_type( block, offset )
{
	offset = typeof offset == 'undefined' ? 0 : offset;
	if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmSp )
	{
		return "Sprites";
	}
	if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmIc )
	{
		return "Icons";
	}
	if ( block.length >= 20 && block.leek( offset + 0 ) == ID_AmBk )
	{
		var type = block.extractString( offset + 12, 8 );
		return utilities.trimString( type, { right: true } );
	}
	return null;
};

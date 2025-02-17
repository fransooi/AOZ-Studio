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
* Licensed under the GNU General Public License v3.0.                          *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                   *
* And in the file AOZ_StudioCodeLicense.pdf.                                   *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtume
 *
 * Banks.
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 28/02/2018
 */
function Banks( aoz )
{
	this.aoz = aoz;
	this.aoz.banks = this;
	this.utilities = aoz.utilities;
	this.manifest = aoz.manifest;
	this.banks = [];
	this.quickBanks = {};
	this.numberOfReserves = 0;

	this.banks[ 1 ] = {};
	this.banks[ 2 ] = {};
	this.banks[ 3 ] = {};
	this.banks[ 5 ] = {};
	this.banks[ 6 ] = {};
	this.banks[ 7 ] = {};
	this.banks[ 8 ] = {};
	this.quickBanks[ "application" ] = {};
	this.banks[ 1 ][ 'application' ] = new ImageBank( this.aoz, ["amos.js","backg.js","check.js","disk.js","emulator.js","error.js","hd.js","kickstart.js","logo.js"], ["image/png","image/png","image/png","image/png","image/png","image/png","image/png","image/png","image/png"], [ "#000000","#FFFFFF","#D1D1D1","#A2A2A2","#737373","#444444","#FF0000","#D10000","#A20000","#730000","#440000","#00FF00","#00D100","#00A200","#007300","#004400","#FFFF00","#D1D100","#A2A200","#737300","#444400","#FF7F00","#E27100","#C46200","#A65300","#884400","#0000FF","#0000D1","#0000A2","#000073","#000044","#00FFFF","#00D1D1","#00A2A2","#007373","#004444","#FF00FF","#D100D1","#A200A2","#730073","#440044","#FFA100","#FFB312","#FFC625","#FFD837","#FFEB4A","#FFFE5D","#002965","#123975","#244985","#365995","#4869A5","#5A79B5","#BF717F","#B26773","#A45D66","#975359","#89494C","#7B3F3F","#8252B4","#623E87","#41295A","#21152D","#000000" ], { hotSpots: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },], masks: '""', alpha: false, domain: 'images', type: 'images', path: '1.images' } );
	this.banks[ 3 ][ 'application' ] = new DataBank( this.aoz, [], 0, { domain: 'musics', type: 'musics', path: '3.musics' } );
	this.banks[ 6 ][ 'application' ] = new ImageBank( this.aoz, [], [], [ "#000000","#FFFFFF","#D1D1D1","#A2A2A2","#737373","#444444","#FF0000","#D10000","#A20000","#730000","#440000","#00FF00","#00D100","#00A200","#007300","#004400","#FFFF00","#D1D100","#A2A200","#737300","#444400","#FF7F00","#E27100","#C46200","#A65300","#884400","#0000FF","#0000D1","#0000A2","#000073","#000044","#00FFFF","#00D1D1","#00A2A2","#007373","#004444","#FF00FF","#D100D1","#A200A2","#730073","#440044","#FFA100","#FFB312","#FFC625","#FFD837","#FFEB4A","#FFFE5D","#002965","#123975","#244985","#365995","#4869A5","#5A79B5","#BF717F","#B26773","#A45D66","#975359","#89494C","#7B3F3F","#8252B4","#623E87","#41295A","#21152D","#000000" ], { hotSpots: [], masks: '""', alpha: false, domain: 'icons', type: 'icons', path: '6.icons' } );
	this.banks[ 2 ][ "application" ] = new TDBank( this.aoz, [], [], { domain: "3D", type: "3D" } );


	// Poke the indexes and reservation numbers.
	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] )
		{
			for ( var c in this.banks[ b ] )
			{
				var bank = this.banks[ b ][ c ];
				if ( bank )
				{
					bank.index = b;
					bank.reserveNumber = this.numberOfReserves++;
				}
			}
		}
	}
};

Banks.ListBanks = function()
{
	var list = {}

	if( application.aoz.banks && application.aoz.banks.banks.length > 0 )
	{
		for( var b = 0; b < application.aoz.banks.banks.length; b++ )
		{
			var bank = application.aoz.banks.banks[ b ];
			if( bank && bank.application && bank.application.domain )
			{
				list[ bank.application.domain ] = [];
				if( bank.application.context && bank.application.context.listNames )
				{
					var keys = Object.keys( bank.application.context.listNames );
					for( var l = 0; l < keys.length; l++ )
					{
						list[ bank.application.domain ].push( { name: keys[ l ].strReplace( bank.application.domain + ':', '' ), item: bank.application.context.listNames[ keys[ l ] ] } );
					}
				}
			}
		}
	}

	return list;
};

Banks.prototype.loadAllBanks = function( type, contextName )
{
	for ( var number = 0; number < this.banks.length; number++ )
	{
		if ( this.banks[ number ] )
		{
			for ( var context in this.banks[ number ] )
			{
				var bank = this.banks[ number ][ context ];
				if ( !bank )
				 	continue;
				if ( typeof type != 'undefined' && bank.type != type )
					continue;
				if ( typeof contextName != 'undefined' && contextName != context )
					continue;
				bank.loadList();
			}
		}
	}
	
};
Banks.prototype.reserve = function( number, type, length, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( number < 0 )
		throw { error: 'illegal_function_call', parameter: number };
	if ( !this.manifest.unlimitedBanks && number > 16 )
		throw { error: 'illegal_function_call', parameter: number };

	var length = typeof length == 'undefined' ? 0 : length;
	if ( length < 0 )
		throw { error: 'illegal_function_call', parameter: length };
	if ( !type || type == '' )
		throw { error: 'illegal_function_call', parameter: type };

	var bank = this.banks[ number ];
	if ( !bank )
		this.banks[ number ] = {};
	type = type.toLowerCase();
	var bank, copyBlock = false;
	switch ( type )
	{
		case 'images':
			bank = new ImageBank( this.aoz, [], [], this.aoz.manifest.default.screen.palette, { domain: type, type: type } );
			break;
		case 'icons':
			bank = new ImageBank( this.aoz, [], [], this.aoz.manifest.default.screen.palette, { domain: type, type: type } );
			break;
		case '3D':
			bank = new TDBank( this.aoz, [], [], { domain: type, type: type } );
			break;
		case 'musics':
			bank = new SampleBank( this.aoz, [], [], { domain: type, type: type } );
			break;
		case 'samples':
			bank = new SampleBank( this.aoz, [], [], { domain: type, type: type } );
			break;
		case 'picpac':
		case 'amal':
			bank = new DataBank( this.aoz, undefined, 0, { domain: type, type: type } );
			break;
		case 'work':
		case 'tracker':
		case 'data':
		default:
			bank = new DataBank( this.aoz, undefined, length, { domain: type, type: type } );
			copyBlock = true;
			break;
	}
	bank.reserveNumber = this.numberOfReserves++;
	bank.index = number;
	this.banks[ number ][ contextName ] = bank;
	this.quickBanks[ contextName ] = {};
	return bank;
};
Banks.prototype.erase = function( bankIndex, noError, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( bankIndex < 1 || ( !this.aoz.unlimitedBanks && bankIndex > 16 ) )
	{
		if ( !noError )
			throw { error: 'illegal_function_call', parameter: bankIndex };
		return;
	}

	if ( !this.banks[ bankIndex ] || !this.banks[ bankIndex ][ contextName ] )
	{
		if ( !noError )
			throw 'bank_not_reserved';
		return;
	}
	this.getBank( bankIndex, contextName ).erase();
	this.banks[ bankIndex ] = this.utilities.cleanObject( this.banks[ bankIndex ], contextName );
	this.quickBanks[ contextName ] = {};
};
Banks.prototype.eraseTemp = function( bankIndex, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] && this.banks[ b ][ contextName ] )
		{
			var bank = this.banks[ b ][ contextName ];
			if ( bank.isType( 'work' ) )
			{
				this.erase( b, contextName );
				this.updateBank( null, b, contextName );
			}
		}
	}
};
Banks.prototype.eraseAll = function( bankIndex, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] && this.banks[ b ][ contextName ] )
		{
			this.erase( b, contextName );
			this.updateBank( null, b, contextName );
		}
	}
};
Banks.prototype.updateBank = function( bank, bankIndex, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	this.aoz.screensContext.parseAll( contextName, function( screen )
	{
		screen.updateBank( bank, bankIndex, contextName )
	} );
	if ( this.aoz.sprites )
	{
		this.aoz.sprites.updateBank( bank, bankIndex, contextName );
	}
};
Banks.prototype.bankShrink = function( bankIndex, newLength, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	var bank = this.getBank( bankIndex, contextName );
	bank.setLength( newLength );
	this.updateBank( bank, bankIndex, contextName );
};
Banks.prototype.bankSwap = function( bankIndex1, bankIndex2, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( bankIndex1 < 1 || bankIndex2 < 1 || typeof bankIndex1 == 'undefined' || typeof bankIndex2 == 'undefined' )
		throw { error: 'illegal_function_call', parameters: [ bankIndex1, bankIndex2 ] };
	if ( !this.manifest.unlimitedBanks && ( bankIndex1 > 16 || bankIndex2 > 16 ) )
		throw { error: 'illegal_function_call', parameters: [ bankIndex1, bankIndex2 ] };

	if ( !this.banks[ bankIndex1 ][ contextName ] || !this.banks[ bankIndex2 ][ contextName ] )
		throw 'bank_not_reserved';

	// Swap!
	var bank1 = this.banks[ bankIndex1 ][ contextName ];
	var bank2 = this.banks[ bankIndex2 ][ contextName ];
	this.banks[ bankIndex1 ][ contextName ] = bank2;
	this.banks[ bankIndex2 ][ contextName ] = bank1;
	bank2.index = bankIndex1;
	bank1.index = bankIndex2;

	// Update banks
	this.quickBanks[ contextName ] = {};
	this.updateBank( bank1, bank1.index, contextName );
	this.updateBank( bank2, bank2.index, contextName );
};
Banks.prototype.getBank = function( bankIndex, contextName, bankType, throwError = true )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	try 
	{
		if ( typeof bankIndex == 'undefined' )
		{
			if ( typeof bankType == 'undefined' )
				throw { error: 'illegal_function_call', parameter: '' };
			if ( bankType == 'images' || bankType == 'icons' || bankType == '3D' || bankType == 'musics' || bankType == 'samples' || bankType == 'amal' )
			{
				if ( this.quickBanks[ contextName ] && this.quickBanks[ contextName ][ bankType ] )
					return this.quickBanks[ contextName ][ bankType ];
				for ( var b = 0; b < this.banks.length; b++ )
				{
					if ( this.banks[ b ] )
					{
						var bank = this.banks[ b ][ contextName ];
						if ( bank && bank.isType( bankType ) )
						{
							if ( !this.quickBanks[ contextName ] )
								this.quickBanks[ contextName ] = {};
							this.quickBanks[ contextName ][ bankType ] = bank;
							return bank;
						}
					}
				}
			}
			throw 'bank_not_reserved';
		}
		if ( bankIndex < 1 )
			throw { error: 'illegal_function_call', parameter: bankIndex };
		if ( !this.aoz.unlimitedBanks && bankIndex > 16 )
			throw { error: 'illegal_function_call', parameter: bankIndex };
	
		if ( !this.banks[ bankIndex ] )
			throw 'bank_not_reserved';
		var bank = this.banks[ bankIndex ][ contextName ];
		if ( !bank )
			throw 'bank_not_reserved';
		if ( bankType && !bank.isType( bankType ))
			throw 'bank_type_mismatch';
	}
	catch( err )
	{ 
		if ( throwError )
			throw err;
		return undefined;
	}
	return bank;
};
Banks.prototype.getBankElement = function( bankIndex, elementNumber, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName ).getElement( elementNumber );
};
Banks.prototype.getStart = function( bankIndex, contextName, elementNumber )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	elementNumber = typeof elementNumber == 'undefined' ? 1 : elementNumber;
	var bank = this.getBank( bankIndex, contextName );
	if ( bank.type == 'tracker' || bank.type == 'data' || bank.type == 'work' )
		return bank.getElement( elementNumber ).memoryHash * this.aoz.memoryHashMultiplier;
	throw 'bank_type_mismatch';
};
Banks.prototype.getLength = function( bankIndex, contextName )
{
	var bank = this.getBank( bankIndex, contextName, undefined, false );
	if ( !bank )
		return 0;
	return bank.getLength();
};
Banks.prototype.listBank = function( contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] )
		{
			var bank = this.banks[ b ][ contextName ];
			if ( bank && bank.getLength() )
			{
				this.aoz.currentScreen.currentTextWindow.printUsing( '###', [ b ], false );
				this.aoz.currentScreen.currentTextWindow.print( ' - ', false );
				this.aoz.currentScreen.currentTextWindow.printUsing( '~~~~~~~~~~~~~~~~~ L: ', [ bank.domain ], false );
				this.aoz.currentScreen.currentTextWindow.print( '' + bank.getLength(), true );
			}
		}
	}
};
Banks.prototype.loadFileToBank = function( pathOrDescriptor, bankIndex, bankType, options, callback, extra )
{
	options = typeof options == 'undefined' ? options : {};
	var contextName = typeof options.contextName == 'undefined' ? this.aoz.currentContextName : options.contextName;

	var descriptor;
	if ( typeof pathOrDescriptor == 'string' )
	{
		descriptor = this.aoz.filesystem.getFile( pathOrDescriptor, { noErrors: true } );
		if ( descriptor.error )
			callback( false, descriptor.error, extra );
	}
	else
	{
		descriptor = pathOrDescriptor;
	}

	var self = this;
	this.aoz.filesystem.loadFile( descriptor, { binary: true }, function( response, arrayBuffer, extra )
	{
		if ( response )
		{
			var block = self.aoz.allocMemoryBlock( arrayBuffer, 'big' );
			var bank = self.aoz.banks.reserve( bankIndex, bankType, block.length, contextName );
			var elementIndex = typeof options.elementIndex == 'undefined' ? 1 : options.elementIndex;
			if ( elementIndex < 0 )
			{
				callback( false, 'illegal_function_call', extra );
				return;
			}
			block.filename = descriptor.name;
			bank.setElement( elementIndex, block );
			callback( true, bank, extra );
		}
		else
		{
			callback( false, 'cannot_load_file', extra );
		}
	}, extra );
};

///////////////////////////////////////////////////////////////////////////
// 3D BANK
///////////////////////////////////////////////////////////////////////////
Banks.prototype.get3DElement = function( bankName, index, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, bankName ).getElement( index );
}

///////////////////////////////////////////////////////////////////////////
// IMAGE / ICONS BANK
///////////////////////////////////////////////////////////////////////////
Banks.prototype.getImage = function( bankName, index, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, bankName ).getElement( index );
};
Banks.prototype.setImageHotSpot = function( bankName, index, position, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, bankName ).setHotSpot( index, position );
};
Banks.prototype.getImageHotSpot = function( bankName, index, position, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, bankName ).getHotSpot( index, position );
};
Banks.prototype.insertImage = function( bankName, index, name, tags, contextName, bankIndex, canvas, hotSpot )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	bank = this.getBank( bankIndex, contextName, bankName );
	var imageObject = bank.add( index, name, tags );
	if ( canvas )
	{
		bank.setElement( index, canvas, hotSpot );
		this.aoz.renderer.newImage( imageObject );
	}	
};
Banks.prototype.insertImageRange = function( bankName, first, last, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, bankName ).addRange( first, last, tags );
};
Banks.prototype.insertImageFromArray = function( bankName, arrayIndex, arrayNames, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	arrayNames = typeof arrayNames == 'undefined' ? {} : arrayNames;
	for ( var i in arrayIndex )
		bank.add( arrayIndex[ i ], arrayNames[ i ], tags );
};
Banks.prototype.setImageCanvas = function( bankName, index, canvas, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, bankName ).getElement( index ).setElement( canvas );
};
Banks.prototype.deleteImage = function( bankName, index, contextName, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	if ( typeof index == 'undefined' )
		bank.reset();
	else
		bank.delete( index );
};
Banks.prototype.deleteImageRange = function( bankName, first, last, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	if ( typeof first == 'undefined' && typeof last == 'undefined' )
		bank.reset();
	else
	{
		last = typeof last != 'undefined' ? last : first + 1;
		bank.deleteRange( first, last );
	}
};
Banks.prototype.deleteImagesFromArray = function( bankName, _array, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	for ( var i in _array )
		bank.delete( _array[ i ] );
};
Banks.prototype.getImagePalette = function( bankName, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, bankName ).getPalette();
};
Banks.prototype.processMask = function( bankName, index, onOff, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	var from = onOff ? { r: 0, g: 0, b: 0, a: 255 } : { r: 0, g: 0, b: 0, a: 0 };
	var to = onOff ? { r: 0, g: 0, b: 0, a: 0 } : { r: 0, g: 0, b: 0, a: 255 };
	if ( typeof number != 'undefined' )
	{
		var element = bank.getElement( index );
		var canvas = element.getCanvas();
		var context = canvas.getContext( '2d' );
		this.utilities.remapBlock( context, [ from ], [ to ], { x: 0, y: 0, width: canvas.width, height: canvas.height } );
	}
	else
	{
		var self = this;
		bank.context.parseAll( contextName, function( element )
		{
			var canvas = element.getCanvas();
			var context = canvas.getContext( '2d' );
			self.utilities.remapBlock( context, [ from ], [ to ], { x: 0, y: 0, width: canvas.width, height: canvas.height } );
		} );
	}
};


function ImageBank( aoz, imageList, imageTypesList, palette, options )
{
	this.aoz = aoz;
	this.utilities = aoz.utilities;
	this.palette = palette;
	options.masks = options.masks.length > 0 ? JSON.parse( options.masks ) :[];
	this.options = options;
	this.domain = options.domain;
	this.type = options.type;
	this.path = options.path;
	this.context = new AOZContext( this.aoz, this.domain, {} );
	if ( imageList )
		this.loadList( imageList, imageTypesList, options );
};
ImageBank.prototype.isType = function( types )
{
	if ( typeof types == 'string' )
		types = [ types ];
	for ( var t = 0; t < types.length; t++ )
	{
		if ( types[ t ] == this.type )
			return true;
	}
	return false;
};
ImageBank.prototype.loadList = function( imageList, imageTypesList, options )
{
	var self = this;
	tags = typeof options.tags == 'undefined' ? '' : options.tags;
	var indexMap = [];
	for ( var i = 0; i < imageList.length; i++ )
	{
		this.aoz.loadingMax++;
		var infos = this.context.getElementInfosFromFilename( this.domain, imageList[ i ], 'image', i + 1, indexMap );
		infos.path = './resources/' + this.path + '/' + imageList[ i ];
		infos.number = i;
		this.utilities.loadUnlockedImage( infos.path, { type: imageTypesList[ i ] }, function( response, imageLoaded, extra )
		{
			if ( response )
			{
				// Calculate transparency?
				if ( !options.alpha )
					imageLoaded = self.utilities.makeTransparentImage( imageLoaded );
					
				// Set color 0 transparent
				var image =
				{
					aoz: self.aoz,
					bank: self,
					name: extra.name,
					path: extra.path,
					canvas: imageLoaded,
					width: imageLoaded.width,
					height: imageLoaded.height,
					hotSpotX: 0,
					hotSpotY: 0,
					collisionMaskMethod: self.aoz.manifest.collisions.method,
					collisionMaskPrecision: self.aoz.manifest.collisions.precision,
					collisionMaskAlphaThreshold: self.aoz.manifest.collisions.alphaThreshold,
					getCanvas: self.getImageCanvas,
					getHotSpot: self.getImageHotSpot,
					getCollisionMask: self.getCollisionMask
				};
				self.context.setElement( this.domain, image, extra.index, true );
				self.setHotSpot( extra.index, options.hotSpots[ extra.number ] );
				self.setTags( extra.index, tags );

				// Call renderer
				self.aoz.renderer.imageLoaded( image, extra );
			}
			self.aoz.loadingCount++;
		}, infos );
	}
};
ImageBank.prototype.load = function( index, name, path, width, height, tags )
{
	var self = this;
	var infos = this.utilities.getElementInfosFromFilename( this.domain, path, 'image' );
	index = typeof index == 'undefined' ? infos.index : index;
	name = typeof name == 'undefined' ? infos.name : name;
	var image = new Image();
	this.aoz.loadingMax++;
	image.onload = function()
	{
		var canvas = document.createElement( 'canvas' );
		canvas.width = typeof width != 'undefined' ? width : this.width;
		canvas.height = typeof height != 'undefined' ? height : this.height;
		var context = canvas.getContext( '2d' );
		context.imageSmoothingEnabled = self.utilities.isTag( tags, [ 'smooth' ] )
		context.drawImage( this, 0, 0 );
		var newImage =
		{
			aoz: self.aoz,
			bank: self,
			name: name,
			canvas: canvas,
			width: canvas.width,
			height: canvas.height,
			hotSpotX: 0,
			hotSpotY: 0,
			collisionMaskMethod: self.aoz.manifest.collisions.method,
			collisionMaskPrecision: self.aoz.manifest.collisions.precision,
			collisionMaskAlphaThreshold: self.aoz.manifest.collisions.alphaThreshold,
			getCanvas: self.getImageCanvas,
			getHotSpot: self.getImageHotSpot,
			getCollisionMask: self.getCollisionMask
		}
		self.context.setElement( this.domain, newImage, index, true );
		self.setTags( index, tags );
		self.aoz.loadingCount++;
	};
	image.src = path;
};
ImageBank.prototype.add = function( index, tags )
{
	var name;
	if ( typeof index == 'string' )
		name = index;
	else
		name = 'image#' + index;
	var image =
	{
		aoz: this.aoz,
		bank: this,
		name: name,
		canvas: null,
		width: 0,
		height: 0,
		hotSpotX: 0,
		hotSpotY: 0,
		collisionMaskMethod: this.aoz.manifest.collisions.method,
		collisionMaskPrecision: this.aoz.manifest.collisions.precision,
		collisionMaskAlphaThreshold: this.aoz.manifest.collisions.alphaThreshold,
		getCanvas: this.getImageCanvas,
		getHotSpot: this.getImageHotSpot,
		getCollisionMask: this.getCollisionMask,
		collisions: null
	}
	this.context.setElement( this.domain, image, index, true );
	this.setTags( image, tags );
	return image;
};
ImageBank.prototype.addRange = function( first, last, tags )
{
	last = typeof last =='undefined' ? first + 1 : last;
	if ( last < first )
		throw { error: 'illegal_function_call', parameters: [ first, last ] };

	var result = [];
	for ( var count = first; count < last; count++ )
	{
		result.push( this.add( count, tags ) );
	}
	return result;
};
ImageBank.prototype.getScreen = function( update )
{
	var screen = undefined;
	if ( this.name.indexOf( 'screen(' ) == 0 )
	{
		var end = this.name.indexOf( ')' );
		var screenIndex = this.name.substring( 7, end );
		screen = this.aoz.getScreen( screenIndex );
		if ( update )
		{
			this.screen = screen;
			this.canvas = screen.canvas;
			this.width = screen.vars.width;
			this.height = screen.vars.height;
			this.hotSpotX = screen.vars.hotSpotX;
			this.hotSpotY = screen.vars.hotSpotY;
		}
	}
	return screen;
};
ImageBank.prototype.getImageCanvas =  function( hRev, vRev )
{
	if ( typeof vRev == 'undefined' )
	{
		vRev = ( hRev & 0x4000 ) != 0;
		hRev = ( hRev & 0x8000 ) != 0;
	}
	//this.bank.getScreen( true );
	var canvas = this.canvas;
	if ( canvas )
	{
		if ( hRev || vRev )
		{
			if ( hRev && vRev )
			{
				if ( !this.canvasRev || canvas.sprite )
					this.canvasRev = this.aoz.utilities.flipCanvas( this.canvas, true, true );
				canvas = this.canvasRev;
			}
			else if ( hRev )
			{
				if ( !this.canvasHRev || canvas.sprite )
					this.canvasHRev = this.aoz.utilities.flipCanvas( this.canvas, true, false );
				canvas = this.canvasHRev;
			}
			else
			{
				if ( !this.canvasVRev || canvas.sprite )
					this.canvasVRev = this.aoz.utilities.flipCanvas( this.canvas, false, true );
				canvas = this.canvasVRev;
			}
		}
	}
	return canvas;
};
ImageBank.prototype.getImageHotSpot =  function( hRev, vRev )
{
	if ( typeof vRev == 'undefined' )
	{
		vRev = ( hRev & 0x4000 ) != 0;
		hRev = ( hRev & 0x8000 ) != 0;
	}
	//this.bank.getScreen( true );
	return { x: hRev ? this.canvas.width - this.hotSpotX : this.hotSpotX, y: vRev ? this.canvas.height - this.hotSpotY : this.hotSpotY };
};
ImageBank.prototype.getCollisionMask = function()
{
	if ( this.aoz.moduleCollisions )
	{
		if ( !this.collisionMask )
		{
			for ( var m in this.bank.options.masks )
			{
				if ( m == this.path )
				{
					this.collisionMask = 				
					{
						imageObject: this,
						hulls: this.aoz.utilities.copyArray( this.bank.options.masks[ m ] )
					}
					return this.collisionMask;
				}
			}
			this.collisionMask = 				
			{
				imageObject: this,
				hulls: this.aoz.moduleCollisions.newImage( this )
			}
		}		
	}
	return this.collisionMask;
};
ImageBank.prototype.getLength = function()
{
	return this.context.getNumberOfElements( this.domain );
};
ImageBank.prototype.setLength = function()
{
	throw 'illegal_function_call';
};
ImageBank.prototype.setElement = function( index, canvas, hotSpot, tags )
{
	var image = this.context.getElement( this.domain, index, 'image_not_defined' );
	image.canvas = canvas;
	if( window.application.aoz.manifest.platform == 'amiga' )
	{
		var ctx = image.canvas.getContext( '2d' );
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		image.canvas.imageSmoothEnabled = false;
	}
	image.width = canvas.width;
	image.height = canvas.height;
	image.canvasRev = null;
	image.canvasHRev = null;
	image.canvasVRev = null;
	if ( hotSpot )
	{
		image.hotSpotX = hotSpot.x;
		image.hotSpotY = hotSpot.y;
	}
};
ImageBank.prototype.getElement = function( index )
{
	var image = this.context.getElement( this.domain, index, 'image_not_defined' );
	if ( image && image.canvas )
		return image;
	throw { error: 'image_not_defined', parameter: index };
};
ImageBank.prototype.getPalette = function()
{
	return this.palette;
};
ImageBank.prototype.setPalette = function( palette )
{
	this.palette = palette;
};
ImageBank.prototype.reset = function()
{
	this.context.reset( this.domain );
};
ImageBank.prototype.delete = function( index )
{
	this.context.deleteElement( this.domain, index );
};
ImageBank.prototype.deleteRange = function( first, last )
{
	this.context.deleteRange( this.domain, first, last );
};
ImageBank.prototype.setTags = function( index, tags )
{
	if ( tags )
	{
		var image;
		if ( this.utilities.isObject( index ) )
			image = index;
		else
			image = this.context.getElement( this.domain, index, 'image_not_defined' );
		if ( this.utilities.isTag( tags, [ 'hotSpotX', 'hotSpotY' ] ) )
		{
			var x = this.utilities.getTagParameter( tags, 'hotSpotX' );
			if ( typeof x == 'string' )
			{
				switch ( x )
				{
					case 'left':
						image.hotSpotX = 0;
						break;
					case 'center':
						image.hotSpotX = image.width / 2;
						break;
					case 'right':
						image.hotSpotX = image.width;
						break;
				}
			}
			else if ( typeof x == 'number' )
			{
				image.hotSpotX = x;
			}

			var y = this.utilities.getTagParameter( tags, 'hotSpotY' );
			if ( typeof y == 'string' )
			{
				switch ( y )
				{
					case 'top':
						image.hotSpotY = 0;
						break;
					case 'middle':
						image.hotSpotY = image.height / 2;
						break;
					case 'bottom':
						image.hotSpotY = image.height;
						break;
				}
			}
			else if ( typeof y == 'number' )
			{
				image.hotSpotY = y;
			}
		}
	}
};
ImageBank.prototype.getHotSpot = function( index, position )
{
	var image = this.context.getElement( this.domain, index, 'image_not_defined' );
	if ( position.toLowerCase() == 'y' )
		return image.hotSpotX;
	return image.hotSpotY;
};
ImageBank.prototype.setHotSpot = function( index, position )
{
	var image = this.context.getElement( this.domain, index, 'image_not_defined' );
	if ( position.x == 'mask' )
	{
		switch ( ( position.y & 0x70 ) >> 4 )
		{
			case 0:
				image.hotSpotX = 0;
				break;
			case 1:
				image.hotSpotX = image.width / 2;
				break;
			case 2:
				image.hotSpotX = image.width;
				break;
		}
		switch ( position.y & 0x07 )
		{
			case 0:
				image.hotSpotY = 0;
				break;
			case 1:
				image.hotSpotY = image.height / 2;
				break;
			case 2:
				image.hotSpotY = image.height;
				break;
		}
	}
	else
	{
		if ( typeof position.x != 'undefined' )
			image.hotSpotX = position.x;
		if ( typeof position.y != 'undefined' )
			image.hotSpotY = position.y;
	}
};
ImageBank.prototype.erase = function( index )
{
};


//////////////////////////////////////////////////////////////////////////
//
// SOUND BANK
//
//////////////////////////////////////////////////////////////////////////
Banks.prototype.samBank = function( number )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( number, contextName, 'samples' );
	this.samBankNumber = number;
};
Banks.prototype.getSound = function( index, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	bankIndex = ( contextName == 'application' ? ( typeof bankIndex == 'undefined' ? this.samBankNumber : bankIndex ) : bankIndex );
	var bank = this.getBank( bankIndex, contextName, 'samples' );
	return bank.getElement( index );
};
Banks.prototype.insertSample = function( index, name, tags, sample, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'samples' );
	bank.add( index, name, tags );
	if ( typeof sample != 'undefined' )
		bank.setElement( index, sample, tags );
};
Banks.prototype.insertSampleRange = function( first, last, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, 'samples' ).addRange( first, last, tags );
};
Banks.prototype.deleteSample = function( index, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, 'samples' ).delete( index );
};
Banks.prototype.deleteSampleRange = function( first, last, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'samples' );
	if ( typeof first == 'undefined' && typeof last == 'undefined' )
	{
		bank.reset( this.domain );
	}
	else
	{
		last = typeof last != 'undefined' ? last : first + 1;
		bank.deleteRange( first, last );
	}
};

function SampleBank( aoz, soundList, soundListTypes, options )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.utilities = aoz.utilities;
	this.options = options;
	this.domain = options.domain;
	this.type = options.type;
	this.path = options.path;
	this.context = new AOZContext( this.aoz, this.domain, {} );
	this.soundList = soundList;
	this.soundListTypes = soundListTypes;
};
SampleBank.prototype.isType = function( types )
{
	if ( typeof types == 'string' )
		types = [ types ];
	for ( var t = 0; t < types.length; t++ )
	{
		if ( types[ t ] == this.type )
			return true;
	}
	return false;
};
SampleBank.prototype.loadList = function( soundList, soundListTypes, callback, extra )
{
	var self = this;
	soundList = typeof soundList != 'undefined' ? soundList : this.soundList;
	soundListTypes = typeof soundListTypes != 'undefined' ? soundListTypes : this.soundListTypes;
	var count = soundList.length;
	var error;
	var indexMap = {};
	for ( var i = 0; i < soundList.length; i++ )
	{
		var element = soundList[ i ];
		var infos = this.context.getElementInfosFromFilename( this.domain, element.a, this.type, i + 1, indexMap );
		infos.path = './resources/' + this.path + '/' + element.a;
		infos.filename = element.b;
		this.aoz.loadingMax++;

		this.utilities.loadUnlockedSound( infos.path, { }, function( response, data, extra )
		{
			if ( response )
			{
				self.aoz.sounds.loadSound( data, function( response, data, extra2 )
				{
					count--;
					self.aoz.loadingCount++;
					if ( response )
					{
						if ( extra2.name )
							data.name = extra2.name;
						self.context.setElement( self.domain, data, extra2.index, true );
					}
					else
					{
						console.log( '*** Cannot load sound: ' + extra2.name );
						error = 'cannot_load_sound';
					}
				}, extra );
			}
			else
			{
				console.log( '*** Cannot load sound: ' + extra.name );				
				error = 'cannot_load_sound';
				count--;
			}
			if ( count == 0 )
			{
				if ( callback )
				{
					if ( !error )
						callback( true, {}, extra );
					else
						callback( false, error, extra );
				}
			}
		}, infos );
	}
};
SampleBank.prototype.load = function( index, name, path, type, tags )
{
	// TODO
};
SampleBank.prototype.addSound = function( index, name, arrayBuffer, tags, callback, extra )
{
	this.aoz.sounds.loadSound( arrayBuffer, function( response, data, extra )
	{
		if ( !response )
		{
			console.log( '*** Cannot load sound: ' + extra.name );
			error = 'cannot_load_sound';
		}
		else
		{			
			this.context.setElement( self.domain, data, index, true );
		}
		callback( response, data, extra );
	}, {} );
};
SampleBank.prototype.add = function( index, name, pool )
{
	if ( typeof name == 'undefined' )
	{
		if ( typeof index == 'string' )
			name = index;
		else
			name = 'sound#' + index;
	}
	var sample =
	{
		name: name,
		filename: '',
		sounds: []
	}
	this.context.setElement( this.domain, sample, index, true );
	if ( typeof tags != 'undefined' )
		this.setTags( index, tags );
	return sample;
};
SampleBank.prototype.addRange = function( first, last, tags )
{
	last = typeof last == 'undefined' ? first + 1 : last;
	if ( last < first || first < 0 || last < 0 )
		throw { error: 'illegal_function_call', parameters: [ first, last ] };
	var result = [];
	for ( var index = first; index < last; index++ )
	{
		var sample =
		{
			name: 'sound#' + index,
			filename: '',
			sounds: []
		}
		result.push( sample );
		this.context.setElement( this.domain, sample, index, true );
		this.setTags( index, tags );
	}
	return result;
};
SampleBank.prototype.setElement = function( index, sound, tags )
{
	this.context.getElement( this.domain, index, 'sound_not_defined' ).sounds = [ sound ];
	this.setTags( index, tags );
};
SampleBank.prototype.getElement = function( index )
{
	return this.context.getElement( this.domain, index, 'sound_not_defined' );
};
SampleBank.prototype.getLength = function()
{
	return this.context.getNumberOfElements( this.domain );
};
SampleBank.prototype.setLength = function()
{
	throw 'illegal_function_call';
};
SampleBank.prototype.reset = function()
{
	return this.context.reset( this.domain );
};
SampleBank.prototype.delete = function( index )
{
	return this.context.deleteElement( this.domain, index );
};
SampleBank.prototype.deleteRange = function( first, last )
{
	return this.context.deleteRange( this.domain, first, last );
};
SampleBank.prototype.setTags = function( index, tags )
{
};
SampleBank.prototype.erase = function( index )
{
};

// 3D bank
/////////////////////////////////////////////////////////////////////////////////
function TDBank( aoz, loadList, types, options )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.utilities = aoz.utilities;
	this.options = options;
	this.domain = options.domain;
	this.type = options.type;
	this.path = options.path;
	this.types = types;
	this.context = new AOZContext( this.aoz, this.domain, {} );
	if ( loadList )
		this.loadList( loadList, types );
};
TDBank.prototype.isType = function( types )
{
	if ( typeof types == 'string' )
		types = [ types ];
	for ( var t = 0; t < types.length; t++ )
	{
		if ( types[ t ] == this.type )
			return true;
	}
	return false;
};
TDBank.prototype.getElement = function( index, type, noError )
{
	var types = 
	{
		scene: [ 'gltf', 'glb', 'obj', 'fbx', 'dae', 'aoz3d' ],
		mesh: [ 'gltf', 'glb', 'obj', 'fbx', 'dae', 'aoz3d' ],
		material: [ ],
		texture: [ 'hdr', 'tga', 'exr' ]
	}
	var errorMessage = noError ? undefined : 'bank_element_not_defined';

	var element;
	if ( !index )
		element = this.context.getElement( this.domain, 1 );
	else
		element = this.context.getElement( this.domain, index );
	if ( element && element.aoz )
	{
		if ( type )
		{
			var list = types[ type ];
			if ( list )
			{
				for ( var l = 0; l < list.length; l++ )
				{
					if ( element.type == list[ l ] )
						return element;
				}
			}
			if ( errorMessage )
				throw { error: errorMessage, parameter: index };
			return undefined;
		}
		return element;
	}
	if ( errorMessage )
		throw { error: errorMessage, parameter: index };
	return undefined;
};
TDBank.prototype.loadList = function( loadList, types )
{
	var indexMap = {};
	for ( var i = 0; i < loadList.length; i++ )
	{
		var infos = this.context.getElementInfosFromFilename( this.domain, loadList[ i ], types[ i ], i + 1, indexMap );		
		var element = new TDElement( this.aoz, this,
		{
			name: this.aoz.utilities.getFilename( loadList[ i ] ),
			path: './resources/' + this.path + '/' + loadList[ i ], 
			filename: loadList[ i ],
			type: types[ i ]
		} );
		this.context.setElement( this.domain, element, infos.index, true );
	}
};
TDBank.prototype.save = function( path, tags )
{
};
TDBank.prototype.add = function( index, name )
{
	if ( typeof name == 'undefined' )
	{
		name = typeof index == 'string' ? index : this.domain + '#' + index;
	}
	this.context.setElement( this.domain, { name: name }, index, true );
};
TDBank.prototype.addRange = function( first, last, tags )
{
	last = typeof last == 'undefined' ? first + 1 : last;
	if ( last < first || first < 0 || last < 0 )
		throw { error: 'illegal_function_call', parameters: [ first, last ] };
	for ( var index = first; index < last; index++ )
	{
		this.context.setElement( this.domain, { name: this.domain + '#' + index }, index, true );
	}
};
TDBank.prototype.setElement = function( index, block, tags )
{
	this.context.setElement( this.domain, block, index, true );
};
TDBank.prototype.erase = function()
{
};
TDBank.prototype.delete = function( index )
{
	return this.context.deleteElement( this.domain, index );
};
TDBank.prototype.deleteRange = function( first, last )
{
	return this.context.deleteRange( this.domain, first, last );
};
TDBank.prototype.getLength = function( index )
{
	return this.context.numberOfElements;
};
TDBank.prototype.setLength = function( newLength )
{
};
TDBank.prototype.setTags = function( index, tags )
{
};


function TDElement( aoz, bank, args )
{
	this.aoz = aoz;
	this.bank = bank;
	this.path = args.path;
	this.filename = args.filename;
	this.type = args.type;
	this.name = args.name;
	this.mesh = args.mesh;
	this.data = null;
}
TDElement.prototype.loadScene = function( options, callback, extra )
{
	if ( !this.data )
	{
		var loader;
		switch ( this.type )
		{
			case 'gltf':
			case 'glb':
				loader = new THREE.GLTFLoader();
				break;
			case 'obj':
				loader = new THREE.OBJLoader();
				break;
			case 'fbx':
				loader = new THREE.FBXLoader();
				break;
			case 'dae':
				loader = new THREE.ColladaLoader();
				break;
			case 'aoz3d':
				loader = new THREE.ObjectLoader();
				break;
			default:
				loader = new this.tdLoader();
				break;					
		}

		var self = this;
		loader.load( this.path + '?update=' + Date.now(), function ( model )
		{
			switch ( self.type )
			{
				case 'aoz3d':
					self.data = model;
					var xhr = new XMLHttpRequest();
					xhr.onload = function( progressEvent )
					{
						var json = JSON.parse( xhr.responseText );
						self.aozData = json.object.aozEvents;							
						callback( true, self, extra );
					};
					xhr.open( "GET", self.path, true );
					xhr.send();
					break;
				
				case 'glb':
				case 'gltf':
				case 'dae':
					self.data = model.scene;
					callback( true, self, extra );
					break;

				case 'obj':
				case 'fbx':
					if ( model.scene )
						self.data = model.scene;
					else
					{
						var group = new THREE.Group();
						if( model.children )
						{
							for( var c = 0; c < model.children.length; c++ )
								group.add( model.children[ c ] );
						}
						else
							group.add( model );
						self.data = group;
					}
					if( model.animations )
					{
						self.animations = model.animations;
						self.mixer = undefined;
					}
					callback( true, self, extra );
					break;
				default:
					this.data = model;
					callback( true, self, extra );
					break;
			}
		}, undefined, function ( error )
		{
			callback( false, 'cannot_load_asset', extra );
		} );
		return null;
	}
	return this.data;
}

TDElement.prototype.loadTexture = function( options, callback, extra )
{
	if ( !this.data )
	{
		var loader;
		switch ( this.type )
		{
			default:
			case 'hdr':
				loader = new THREE.RGBELoader();
				break;
			case 'tga':
				loader = new THREE.TGALoader();
				break;
			case 'exr':
				loader = new THREE.EXRLoader();
				break;
		}

		var self = this;
		loader.setPath( this.aoz.utilities.getDirectoryFromPath( this.path ) + '/' )
		loader.load( this.filename, function ( texture )
		{
			self.data = texture;
			callback( true, texture, extra );
		}, undefined, function ( error )
		{
			callback( false, 'cannot_load_asset', extra );
		} );
		return null;
	}
	return this.data;
}

TDElement.prototype.loadObject = function( options, callback, extra )
{
	if ( !this.data )
	{
		if ( this.type == 'mesh' )
			this.data = this.mesh;
		else
		{
			var loader;
			switch ( this.type )
			{
				case 'gltf':
				case 'glb':
					loader = new THREE.GLTFLoader();
					break;
				case 'obj':
					loader = new THREE.OBJLoader();
					break;
				case 'fbx':
					loader = new THREE.FBXLoader();
					break;
				case 'dae':
					loader = new THREE.ColladaLoader();
					break;
				case 'aoz3d':
					loader = new THREE.ObjectLoader();
					break;
				default:
					loader = new this.tdLoader();
					break;					
			}

			var self = this;
			loader.load( this.path + '?update=' + Date.now(), function ( model )
			{
				switch ( self.type )
				{
					//case 'aoz3d':
					case 'gltf':
					case 'dae':
						if ( model.scene.children.length > 0 )
						{
							self.data = model.scene.children[ 0 ].clone();
							callback( true, self, extra );
							return;
						}
						break;

					case 'glb':
						var group = new THREE.Group();
						model = model.scene;
						if( model.children )
						{
							for( var c = 0; c < model.children.length; c++ )
								group.add( model.children[ c ] );
						}
						else
							group.add( model );
						self.data = group;
						callback( true, self, extra );
						return;

					case 'obj':
					case 'fbx':
						if ( model.scene )
							self.data = model.scene;
						else
						{
							var group = new THREE.Group();
							if( model.children )
							{
								for( var c = 0; c < model.children.length; c++ )
									group.add( model.children[ c ] );
							}
							else
								group.add( model );
							self.data = group;
						}
						if( model.animations )
						{
							self.animations = model.animations;
							self.mixer = undefined;
						}
						callback( true, self, extra );
						return;

					default:
						this.data = model;
						callback( true, self, extra );
						return;
				}
				callback( false, self, extra );
			}, undefined, function ( error )
			{
				callback( false, 'cannot_load_asset', extra );
			} );
			return null;
		}
	}
	return this;
}

// Little loader for unknown types.
function tdLoader()
{
}
tdLoader.prototype.load = function( path, callback )
{
	var xhr = new XMLHttpRequest();
	xhr.onload = function( progressEvent )
	{
		callback( xhr.responseText );
	};
	xhr.open( "GET", path, true );
	xhr.send();
}

// DATA Bank
////////////////////////////////////////////////////////////////////
function DataBank( aoz, loadList, length, options )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.utilities = aoz.utilities;
	this.options = options;
	this.domain = options.domain;
	this.type = options.type;
	this.path = options.path;
	this.context = new AOZContext( this.aoz, this.domain, {} );
	if ( loadList )
		this.loadList( loadList, options.tags );
	else if ( length > 0 )
		this.context.setElement( this.domain, this.aoz.allocMemoryBlock( length, this.aoz.endian ), 1, true );
};
DataBank.prototype.isType = function( types )
{
	if ( typeof types == 'string' )
		types = [ types ];
	for ( var t = 0; t < types.length; t++ )
	{
		if ( types[ t ] == this.type )
			return true;
	}
	return false;
};
DataBank.prototype.getElement = function( index, noError )
{
	var errorMessage = noError ? undefined : 'bank_element_not_defined';

	var element;
	if ( !index )
		element = this.context.getElement( this.domain, 1, errorMessage );
	else
		element = this.context.getElement( this.domain, index, errorMessage );
	if ( element && element.aoz )
		return element;
	if ( errorMessage )
		throw { error: errorMessage, parameter: index };
	return undefined;
};
DataBank.prototype.loadList = function( loadList, tags )
{
	var self = this;
	tags = typeof tags == 'undefined' ? '' : tags;
	var indexMap = [];
	for ( var i = 0; i < loadList.length; i++ )
	{
		var element = loadList[ i ];
		var infos = this.context.getElementInfosFromFilename( this.domain, element.a, this.type, i + 1, indexMap );
		infos.path = './resources/' + this.path + '/' + element.a;
		infos.filename = element.b;
		this.utilities.loadUnlockedBankElement( infos.path, infos, function( response, data, extra )
		{
			if ( response )
			{
				var block = self.aoz.allocMemoryBlock( data, self.aoz.endian );
				block.path = extra.path;
				block.name = extra.name;
				block.filename = extra.filename;
				self.context.setElement( self.domain, block, extra.index, true );
			}
		}, infos );
	}
};
DataBank.prototype.save = function( path, tags )
{
	var start = this.getElement();
	this.aoz.filesystem.saveBinary( path, {}, function( response, data, extra )
	{
		self.load_done = true;
		if ( !response )
			throw data;
	} );
};
DataBank.prototype.add = function( index, name )
{
	if ( typeof name == 'undefined' )
	{
		name = typeof index == 'string' ? index : this.domain + '#' + index;
	}
	this.context.setElement( this.domain, { name: name }, index, true );
};
DataBank.prototype.addRange = function( first, last, tags )
{
	last = typeof last == 'undefined' ? first + 1 : last;
	if ( last < first || first < 0 || last < 0 )
		throw { error: 'illegal_function_call', parameters: [ first, last ] };
	for ( var index = first; index < last; index++ )
	{
		this.context.setElement( this.domain, { name: this.domain + '#' + index }, index, true );
	}
};
DataBank.prototype.setElement = function( index, block, tags )
{
	this.context.setElement( this.domain, block, index, true );
};
DataBank.prototype.erase = function()
{
	for ( var block = this.context.getFirstElement( this.domain ); block !=null; block = this.context.getNextElement( this.domain ) )
		this.aoz.freeMemoryBlock( block );
};
DataBank.prototype.delete = function( index )
{
	return this.context.deleteElement( this.domain, index );
};
DataBank.prototype.deleteRange = function( first, last )
{
	return this.context.deleteRange( this.domain, first, last );
};
DataBank.prototype.getLength = function( index )
{
	if ( this.type == 'tracker' )
	{
		if ( typeof index == 'undefined' )
			return this.context.numberOfElements;
		else
			return this.getElement( index ).length;
	}
	var element = this.context.getElement( this.domain, 1 );
	if ( element && element.aoz )
		return element.length;
	return this.context.numberOfElements;
};
DataBank.prototype.setLength = function( newLength )
{
	if ( this.type == 'tracker' )
		throw 'illegal_function_call';
	var element = this.context.getElement( this.domain, 1 );

	// If MemoryBlock
	if ( element && element.aoz )
	{
		element.setLength( newLength );
		return;
	}
	throw 'illegal_function_call';
};
DataBank.prototype.setTags = function( index, tags )
{
};

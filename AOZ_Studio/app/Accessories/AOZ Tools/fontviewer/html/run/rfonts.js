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
* And in the file license.pdf.                                                 *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * Fonts!
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/03/2018
 */

function Fonts( aoz )
{
	this.aoz = aoz;
	this.manifest = aoz.manifest;
	this.utilities = aoz.utilities;
	this.banks = aoz.banks;
	this.miniCanvas = document.createElement( 'canvas' );
	this.miniCanvas.width = 16;
	this.miniCanvas.heigth = 16;
	this.miniContext = this.miniCanvas.getContext( '2d' );
	this.fontInformations = [];
	this.windowFonts = {};
	this.windowFontsInformations = {};

	this.setWindowFont( "IBM Plex Mono","google",26.65,"normal","normal","normal","","application");
	this.getFonts(["aclonica","acme","adamina","aguafina script","akronim","allerta stencil","annie use your telescope","baloo","bonbon","chelsea market","crafty girls","creepster","damion","diplomata","dorsa","dr sugiyama","east sea dokdo","eater","emilys candy","ewert","expletus sans","fascinate inline","faster one","finger paint","flamenco","flavors","fontdiner swanky","francois one","fredericka the great","frijole","galindo","geo","geostar","germania one","graduate","griffy","gugi","hanalei","hanalei fill","henny penny","homemade apple","ibm plex mono","irish grover","jolly lodger","kirang haerang","kranky","lacquer","lakki reddy","lato","league script","love ya like a sister","luckiest guy","margarine","megrim","metal mania","monofett","monoton","mountains of christmas","mystery quest","new rocker","nosifer","nova mono","open sans","overpass mono","oxygen mono","pangolin","passero one","permanent marker","piedra","pirata one","pixeltype","plaster","poiret one","princess sofia","pt mono","racing sans one","rakkas","raleway","raleway dots","red hat display","red hat text","righteous","roboto","roboto mono","roboto slab","rock salt","rye","saira stencil one","sancreek","sarina","schoolbell","seaweed script","share tech mono","shojumaru","sigmar one","single day","sirin stencil","smokum","snowburst one","sonsie one","source code pro","space mono","special elite","spicy rice","stalinist one","stardos stencil","supermercado one","swanky and moo moo","syncopate","text me one","trade winds","trocchi","ubuntu","ubuntu mono","ultra","uncial antiqua","underdog","unifrakturcook","unifrakturmaguntia","vast shadow","vt323","wallpoet","warnes","wire one","work sans","yatra one","yeon sung","yeseva one","zcool kuaile","zeyada","zilla slab","zilla slab highlight"],[],"application");


	// Load first font on the list
	var self = this;
	this.firstFontHeight = 16;
	var reference = this.getFirstFont();
	if ( reference )
	{
		this.aoz.loadingMax++;
		this.getFont( reference, this.firstFontHeight, undefined, undefined, undefined, '', this.aoz.currentContextName, function( response, font, extra )
		{
			self.aoz.loadingCount++;
			if ( response )
				self.firstFont = font;
		} );
	}
}
Fonts.EMPTYAMIGACHAR_KERN = 2;
Fonts.EMPTYAMIGACHAR_SPACE = 2;
Fonts.EMPTYAMIGACHAR_WIDTH = 4;

Fonts.prototype.getFonts = function( googleList, amigaList, contextName )
{
	for ( var a = 0; a < googleList.length; a++ )
	{
		var name = googleList[ a ];
		var fontInformation = this.fontInformations.find( function( element ) { return element.name.toLowerCase() == name.toLowerCase(); } );
		if ( !fontInformation )
		{
			fontInformation =
			{
				index: name.toLowerCase(),
				name: name,
				type: 'google',
				contextNames: {},
				fonts: {}
			};
			this.fontInformations.push( fontInformation );
		}
		fontInformation.contextNames[ contextName ] = true;
	}
	for ( var a = 0; a < amigaList.length; a++ )
	{
		var name = amigaList[ a ];
		var fontInformation = this.fontInformations.find( function( element ) { return element.name.toLowerCase() == name.toLowerCase(); } );
		if ( !fontInformation )
		{
			var fontInformation =
			{
				index: name.toLowerCase(),
				name: name,
				type: 'amiga',
				contextNames: {},
				fonts: {}
			};
			this.fontInformations.push( fontInformation );
		}
		fontInformation.contextNames[ contextName ] = true;
	}
}
Fonts.prototype.setWindowFont = function( name, type, height, weight, italic, stretch, tags, contextName )
{
	var fontInformation;
	var fontID = name + '_' + type;
	for ( var count = 0; count < this.fontInformations.length; count++ )
	{
		var fontInfo = this.fontInformations[ count ];
		if ( name == fontInfo.name && type == fontInfo.type )
		{
			fontInformation = fontInfo;
			break;
		}
	}
	if ( !fontInformation )
	{
		if ( this.windowFontsInformations[ fontID ] )
			fontInformation = this.windowFontsInformations[ fontID ];
	}
	if ( !fontInformation )
	{
		fontInformation =
		{
			index: name.toLowerCase(),
			name: name,
			type: type,
			contextNames: {},
			fonts: {}
		};
		fontInformation.contextNames[ contextName ] = true;
		this.getFont( fontInformation, height, weight, italic, stretch, tags + '#setwindowfont', contextName );
	}
	else
	{
		fontInformation.contextNames[ contextName ] = true;
	}
	this.windowFontsInformations[ fontID ] = fontInformation;
};
Fonts.prototype.getFontInformation = function( reference, contextName )
{
	if ( !this.fontInformations )
		throw 'fonts_not_examined';
	if ( typeof reference == 'undefined' )
		throw 'illegal_function_call';

	var fontInformation, fontName;
	if ( this.utilities.isObject( reference ) )
	{
		if ( typeof reference.contextNames != 'undefined' )
			fontInformation = reference;
		else
			reference = reference.fontInformation.name;
	}
	else if ( typeof reference == 'number' )
	{
		if ( reference < 0 )
			throw { error: 'illegal_function_call', parameter: reference };
		var count = 0, found = -1;
		for ( var f = 0; f < this.fontInformations.length; f++ )	
		{
			if ( this.fontInformations[ f ].contextNames[ contextName ] )
			{
				if ( count == reference )
				{
					found = count;
					break;
				}
				count++;
			}
		}
		if ( found >= 0 )
			return this.fontInformations[ found ];
	}
	if ( !fontInformation && reference && reference.toLowerCase )
	{
		reference = reference.toLowerCase();
		for ( var f = 0; f < this.fontInformations.length; f++ )
		{
			if ( this.fontInformations[ f ].index == reference )
			{
				//if ( this.fontInformations[ f ].contextNames[ contextName ] )
				{
					fontInformation = this.fontInformations[ f ];
					break;
				}
			}
		}
	}
	if ( !fontInformation )
		throw 'font_not_available';
	return fontInformation;
};
Fonts.prototype.getAmigaFontDefinition = function( font, height )
{
	var result = {};
	result.definition = AmigaFonts[ font.fontInformation.name ];
	result.characters = AmigaCharacters[ font.fontInformation.name ];
	if ( !result.definition || !result.characters )
		throw 'font_not_defined';
	if ( height )
	{
		result.heightDefinition = result.definition[ height ];
		result.characterSet = result.characters[ height ];
	}
	if ( !result.heightDefinition )
	{
		height = font.baseHeight;
		result.heightDefinition = result.definition[ height ];
		result.characterSet = result.characters[ height ];
	}		
	result.characterSet.realHeight = height;
	return result;
};
Fonts.prototype.getFirstFont = function()
{
	for ( var reference in this.fontInformations )
	{
		if ( this.fontInformations[ reference ].contextNames[ this.aoz.currentContextName ] )
			return this.fontInformations[ reference ];
	}
	return null;
};
Fonts.prototype.getFont = function( reference, height, weight, italic, stretch, tags, contextName, callback, extra )
{
	var fontInformation = this.getFontInformation( reference, contextName );
	var self = this;
	this.loadFont( fontInformation, weight, italic, stretch, function( response, font, extra )
	{
		if ( response )
		{
			if ( !font.baseLines[ height ] )
			{
				if ( font.fontInformation.type == 'google' )
					font.baseLines[ height ] =	self.getTextMetrics( font.fontInformation.name, height, font.weight ).baseline;
				else
				{
					var foundHeight, foundBase;
					var maxHeight = 0;
					for ( var h in font.fontCode )
					{
						var hh = parseInt( h );
						if ( hh > maxHeight )
						{
							maxHeight = hh;
							foundBase = font.fontCode[ hh ].baseLine;
						}
						var delta = hh - height;
						if ( delta >= 0 )
						{
							foundBase = font.fontCode[ hh ].baseLine;
							foundHeight = hh;
							break;
						}
					}
					if ( foundHeight )
						font.baseHeight = foundHeight;
					else
						font.baseHeight = maxHeight;
					font.baseLines[ height ] = foundBase * height / font.baseHeight;
					font.canvasDefinitions[ height ] = [];
				}
			}
			font.fontInformation.contextNames[ contextName ] = true;
			if ( self.aoz.utilities.isTag( tags, [ 'setWindowFont' ] ) )
				self.windowFonts[ contextName ] = font;
			if ( callback )
				callback( true, font, extra );
		}
		else
		{
			if ( callback )
				callback( false, null, extra );
		}
	} );
};
Fonts.prototype.loadFont = function( fontInformation, weight, italic, stretch, callback, extra )
{
	weight = typeof weight == 'undefined' ? 'normal' : weight;
	italic = typeof italic == 'undefined' ? 'normal' : italic;
	stretch = typeof stretch == 'undefined' ? 'normal' : stretch;	

	var self = this;
	if ( fontInformation.type == 'google' )
	{
		var fontStyleIndex = 'italic:' + italic + 'weight:' + weight + 'stretch:' + stretch;
		if ( !fontInformation.fonts[ fontStyleIndex ] )
		{
			var font =
			{
				weight: weight == 'bold' ? 700 : 'normal',
				style: italic,
				strech: stretch
			};
			var observer = new FontFaceObserver( fontInformation.name, font );
			this.aoz.loadingMax++;
			observer.load().then( function()
			{
				self.aoz.loadingCount++;
				font.fontInformation = fontInformation;
				font.baseLines = [];
				fontInformation.fonts[ fontStyleIndex ] = font;
				callback( true, font, extra );
			}, function( error )
			{
				console.error( 'Font loader error: ' + fontInformation.name + ' / ' + error );
				self.aoz.loadingCount++;
				self.aoz.loadingError = 'cannot_load_font';
				self.aoz.loadingErrorParameter = fontInformation.name;
				callback( false, null, extra );
			} );
	   	}
		else
		{
			callback( true, fontInformation.fonts[ fontStyleIndex ], extra );
		}
	}
	else if ( fontInformation.type == 'amiga' )
	{
		if ( !fontInformation.font )
		{
			var path = './resources/fonts/amiga/' + fontInformation.name + '.js';
			this.aoz.loadingMax++;
			this.utilities.loadScript( path, {}, function( response, data, extra )
			{
				self.aoz.loadingCount++;
				if ( response )
				{
					fontInformation.font =
					{
						fontCode: AmigaFonts[ fontInformation.name ],
						fontInformation: fontInformation,
						canvasDefinitions: [],
						baseLines: [],
						italic: italic,
						weight: weight,
						stretch: stretch
					};
					for ( var c = 0; c < 256; c++ )
						fontInformation.font.canvasDefinitions[ c ] = [];
					callback( true, fontInformation.font, extra );
				}
				else
				{
					self.aoz.loadingError = 'cannot_load_font';
					self.aoz.loadingErrorParameter = fontInformation.name;
					callback( false, null, extra );
				}
			} );
		}
		else
		{
			callback( true, fontInformation.font, extra );
		}
	}
};
Fonts.prototype.getNumberOfFonts = function( type, contextName )
{
	contextName = typeof contextName != 'undefined' ? contextName : this.aoz.currentContextName;
	var amiga = typeof type == 'undefined' ? true : ( type.toLowerCase() == 'amiga');
	var google = typeof type == 'undefined' ? true : ( type.toLowerCase() == 'google');
	var count = 0;
	for ( var f = 0; f < this.fontInformations.length; f++ )
	{
		var fontInformation = this.fontInformations[ f ];
		if ( fontInformation.contextNames[ contextName ] )
		{
			if ( amiga && fontInformation.type == 'amiga' )
				count++;
			if ( google && fontInformation.type == 'google' )
				count++;
		}
	}
	return count;
};
Fonts.prototype.getFont$ = function( reference )
{
	var result = '';
	if ( this.aoz.platform == 'amiga' )
	{
		if ( reference == 0 )
			return result;
		reference--;
	}

	var fontInformation = this.getFontInformation( reference, this.aoz.currentContextName );
	if ( fontInformation  && fontInformation.contextNames[ this.aoz.currentContextName ] )
	{
		if ( !this.manifest.fonts.listFonts || this.manifest.fonts.listFonts.toLowerCase() == 'amiga' )
		{
			result += fontInformation.name;
			while ( result.length < 32 )
				result += ' ';
			result += 16;
			while ( result.length < 36 )
				result += ' ';
			result += fontInformation.type == 'amiga' ? 'rom' : 'disc';
		}
		else
		{
				result += fontInformation.name + ' ';
				result += '(' + fontInformation.type + '): ';
				if ( fontInformation.type == 'google' )
				{
				var fontCode = GoogleFonts[ fontInformation.name.toLowerCase() ];
					for ( var f = 0; f < fontCode.sizes.length; f++ )
					{
						var fontDef = fontCode.sizes[ f ];
						result += fontDef.weight + ', ' + fontDef.style + ( f < fontCode.sizes.length -1 ? '; ' : '' );
					}
				}
				else
				{
					result += fontInformation.baseHeight;
			}
		}
	}
	return result;
};
Fonts.prototype.getBaseLine = function( font, height )
{
	return font.baseLines[ height ];
};
Fonts.prototype.getTextLength = function( text, font, height )
{
	if ( font.fontInformation.type == 'amiga' )
	{
		var result = 0;
		var fontDefinition = this.getAmigaFontDefinition( font, height )
		for ( var p = 0; p < text.length; p++ )
		{
			var c = text.charCodeAt( p );
			if ( c >= fontDefinition.heightDefinition.loChar && c <= fontDefinition.heightDefinition.hiChar )
			{
				var charDefinition = fontDefinition.characterSet[ c - fontDefinition.heightDefinition.loChar ];
				result += charDefinition.space + charDefinition.kern;
			}
			else
			{
				result += Fonts.EMPTYAMIGACHAR_SPACE + Fonts.EMPTYAMIGACHAR_KERN;
			}
		}
		return result;
	}
	else if ( font.fontInformation.type == 'google' )
	{
		this.miniContext.font = this.utilities.getFontString( font.fontInformation.name, height, font.weight, font.italic );
		return this.miniContext.measureText( text ).width;
	}
	throw 'font_not_available';
};
Fonts.prototype.drawAmigaText = function( context, scale, x, y, text, font, height, textAlign, textBaseLine, direction, fillStyle, alpha, fontWidth )
{
	var fontDefinition = this.getAmigaFontDefinition( font, height );
	if ( textAlign == 'center' || textAlign == 'right' )
	{
		var width = this.getTextLength( text, font, height );
		if ( textAlign == 'center' )
			x -= width / 2;
		else
			x -= width;
	}
	if ( textBaseLine == 'bottom' )
		y -= height;
	else if ( textBaseLine != 'top' )
		y -= font.baseLines[ height ];

	context.globalAlpha = alpha;
	context.imageSmoothingEnabled = false;
	var scaleDisplay = scale;	// * subScale;
	var xx = 0;
	for ( var c = 0; c < text.length; c++ )
	{
		var result = this.getAmigaCharacter( font, fontDefinition, text.charCodeAt( c ), height, fillStyle );
		context.drawImage( result.canvas, 0, 0, result.canvas.width, result.canvas.height, x + xx, y, result.canvas.width * scaleDisplay, height * scaleDisplay );
		if ( !fontWidth )
			xx += ( result.charDefinition.kern + result.charDefinition.space ) * scaleDisplay;
		else
			xx += fontWidth * scaleDisplay;
	}
};
Fonts.prototype.getAmigaCharacter = function( font, fontDefinition, c, height, fillStyle )
{
	var charDefinition;
	if ( c >= fontDefinition.heightDefinition.loChar && c <= fontDefinition.heightDefinition.hiChar )
		charDefinition = fontDefinition.characterSet[ c - fontDefinition.heightDefinition.loChar ];
	else
	{
		charDefinition =
		{
			kern: 0,
			space: 0,
			width: 0
		};
		var count = 0;
		var check = ' il.,;:';
		for ( var p = 0; p < check.length; p ++)
		{
			var asc = check.charCodeAt( p );
			if ( asc >= fontDefinition.heightDefinition.loChar && asc <= fontDefinition.heightDefinition.hiChar )
			{
				var def = fontDefinition.characterSet[ asc - fontDefinition.heightDefinition.loChar ];
				charDefinition.kern += def.kern;
				charDefinition.space += def.space;
				charDefinition.width += def.width;
				count++;
			}
		}
		if ( count > 0 )
		{
			charDefinition.kern /= count;
			charDefinition.space /= count;
			charDefinition.width /= count;
		}
		else
		{ 
			charDefinition.kern /= Fonts.EMPTYAMIGACHAR_KERN;
			charDefinition.space /= Fonts.EMPTYAMIGACHAR_SPACE;
			charDefinition.width /= Fonts.EMPTYAMIGACHAR_WIDTH;
		}
	}

	var fontIndex = Math.floor( height );
	var canvasDefinition = font.canvasDefinitions[ fontIndex ][ c ];
	if ( canvasDefinition )
	{
		if ( canvasDefinition.fillStyle == fillStyle )
			return { canvas: canvasDefinition.canvas, charDefinition: charDefinition };
	}

	// New canvas!
	var canvas = document.createElement( 'canvas' );
	canvas.width = fontDefinition.characterSet.realHeight;
	canvas.height = fontDefinition.characterSet.realHeight;
	var context = canvas.getContext( '2d' );
	context.fillStyle = fillStyle;
	context.imageSmoothingEnabled = false;
	if ( charDefinition.bitmap )
	{
		var modulo = Math.floor( charDefinition.width / 8 ) + ( ( charDefinition.width & 7 ) != 0 ? 1 : 0 );
		for ( var y = 0; y < fontDefinition.characterSet.realHeight; y++ )
		{
			var address = y * modulo;
			var byte = charDefinition.bitmap[ address ];
			var mask = 0x80;
			for ( x = 0; x < charDefinition.width; x++ )
			{
				if ( ( byte & mask ) != 0 )
				{
					context.fillRect( x, y, 1, 1 );
				}
				mask >>= 1;
				if ( mask == 0 )
				{
					mask = 0x80;
					address++;
					byte = charDefinition.bitmap[ address ];
				}
			}
		}
	}
	/*
	if ( height != fontDefinition.characterSet.realHeight )
	{
		var canvas2 = document.createElement( 'canvas' );
		canvas2.width = height;
		canvas2.height = height;
		var context2 = canvas2.getContext( '2d' );
		context2.imageSmoothingEnabled = false;
		context2.drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, height, height );
		canvas = canvas2;
	}
	*/
	font.canvasDefinitions[ fontIndex ][ c ] = { fillStyle: fillStyle, canvas: canvas };
	return { canvas: canvas, charDefinition: charDefinition };
};

Fonts.prototype.getTextMetrics = function(fontFamily, fontSize, fontWeight)
{
	var padding;
	var context;
	var canvas;
	var chars =
	{
		capHeight: 'S',
		baseline: 'n',
		xHeight: 'x',
		descent: 'p',
		ascent: 'h',
		tittle: 'i'
	};

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var padding = fontSize * 0.5;
	canvas.width = fontSize * 2;
	canvas.height = fontSize * 2 + padding;
	fontSize = typeof fontSize != 'undefined' ? fontSize : 10;
	fontWeight = typeof fontWeight != 'undefined' ? fontWeight : 400;
	context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
	context.textBaseline = 'top';
	context.textAlign = 'center';

	var result =
	{
		capHeight: measureTop(chars.capHeight),
		baseline: measureBottom(chars.baseline),
		xHeight: measureTop(chars.xHeight),
		descent: measureBottom(chars.descent),
		bottom: computeLineHeight(),
		ascent: measureTop(chars.ascent),
		tittle: measureTop(chars.tittle),
		top: 0
	};
	return result;

	function measureTop(text)
	{
		var pixels = updateText( text );
		return Math.round(getFirstIndex(pixels) / canvas.width) - padding;
	};

	function measureBottom(text)
	{
		var pixels = updateText(text);
		return Math.round(getLastIndex(pixels) / canvas.width) - padding;
	};

	function updateText( text )
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText(text, canvas.width / 2, padding, canvas.width);
		return context.getImageData(0, 0, canvas.width, canvas.height).data;
	};

	function setAlignment(baseline = 'top')
	{
		var ty = baseline === 'bottom' ? canvas.height : 0;
		context.setTransform(1, 0, 0, 1, 0, ty);
		context.textBaseline = baseline;
	};

	function computeLineHeight()
	{
		var letter = 'A';
		setAlignment('bottom');
		updateText( letter );
		var gutter = canvas.height - measureBottom(letter);
		setAlignment('top');
		updateText( letter );
		return measureBottom(letter) + gutter;
	};

	function getFirstIndex( pixels )
	{
		for (var i = 3, n = pixels.length; i < n; i += 4)
		{
			if (pixels[i] > 0)
				return (i - 3) / 4;
		}
		return pixels.length;
	};

	function getLastIndex( pixels )
	{
		for (var i = pixels.length - 1; i >= 3; i -= 4)
		{
			if (pixels[i] > 0)
				return i / 4;
		}
		return 0;
	};

	function normalize(metrics, fontSize, origin)
	{
		var result = {};
		var offset = metrics[origin];
		for (let key in metrics)
		{
			result[key] = (metrics[key] - offset) / fontSize;
		}
		return result;
	};
};

Fonts.prototype.bitmapFont = function( fontRef, charWidth, charHeight, imageRef, scaleX, scaleY, spacingX, spacingY )
{
	BitmapFonts[ 'bitmapfont_' + fontRef ] = 
	{
		image: imageRef,
		width: charWidth,
		height: charHeight,
		scaleX: scaleX,
		scaleY: scaleY,
		spacingX: spacingX,
		spacingY: spacingY
	};
};	

Fonts.prototype.bitmapText = function( text, x, y, fontRef, fontStyle )
{
	if( BitmapFonts == undefined || BitmapFonts[ 'bitmapfont_' + fontRef ] == undefined )
	{
		return false;
	}
	
	if( text == undefined || text == null || text == '' )
	{
		return false;
	}
	var bFont = BitmapFonts[ 'bitmapfont_' + fontRef ];	
	var image = this.aoz.fonts.banks.getImage( 'images', bFont.image, this.aoz.currentContextName, 1 );
	if( image.canvas )
	{
		var canvas = document.createElement( 'canvas' );
		canvas.width = text.length * ( bFont.width * bFont.scaleX );
		canvas.height = bFont.height  * bFont.scaleY;
		for( var c = 0; c < text.length; c++ )
		{
			var a = text.charCodeAt( c );
			a = a - 32;
			
			var context = canvas.getContext( '2d' );
			if( context.imageSmoothingEnabled )
			{
				context.imageSmoothingEnabled = false;
			}
			else if( context.mozImageSmoothingEnabled )
			{
				context.mozImageSmoothingEnabled = false;
			}
			else if( context.webkitImageSmoothingEnabled )
			{
				context.webkitImageSmoothingEnabled = false;
			}
			else if( context.msImageSmoothingEnabled )
			{
				context.msImageSmoothingEnabled = false;
			}

			canvas.getContext( '2d' ).drawImage( image.canvas,  ( a * bFont.width ) + ( a * bFont.spacingX ), ( fontStyle - 1 ) * bFont.height, bFont.width, bFont.height, c * ( bFont.width * bFont.scaleX ), 0, bFont.width * bFont.scaleX, bFont.height * bFont.scaleY );
		}
		
		this.aoz.fonts.banks.insertImage( 'images', "bitmap_text_aoz", undefined, undefined, this.aoz.currentContextName, undefined, canvas );
		this.aoz.currentScreen.pasteImage( 'images', "bitmap_text_aoz", x, y, undefined, undefined, -( ( undefined ) * this.aoz.degreeRadian ) );
	}
	
};

// Fonts definitions...
AmigaFonts = {};
AmigaCharacters = {};
GoogleFonts = {};
BitmapFonts = {};

GoogleFonts["aclonica"]=
{
	name:"Aclonica",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["acme"]=
{
	name:"Acme",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["adamina"]=
{
	name:"Adamina",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["aguafina script"]=
{
	name:"Aguafina Script",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["akronim"]=
{
	name:"Akronim",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["allerta stencil"]=
{
	name:"Allerta Stencil",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["annie use your telescope"]=
{
	name:"Annie Use Your Telescope",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["baloo"]=
{
	name:"Baloo",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["bonbon"]=
{
	name:"Bonbon",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["chelsea market"]=
{
	name:"Chelsea Market",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["crafty girls"]=
{
	name:"Crafty Girls",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["creepster"]=
{
	name:"Creepster",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["damion"]=
{
	name:"Damion",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["diplomata"]=
{
	name:"Diplomata",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["dorsa"]=
{
	name:"Dorsa",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["dr sugiyama"]=
{
	name:"Dr Sugiyama",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["east sea dokdo"]=
{
	name:"East Sea Dokdo",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["eater"]=
{
	name:"Eater",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["emilys candy"]=
{
	name:"Emilys Candy",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["ewert"]=
{
	name:"Ewert",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["expletus sans"]=
{
	name:"Expletus Sans",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["fascinate inline"]=
{
	name:"Fascinate Inline",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["faster one"]=
{
	name:"Faster One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["finger paint"]=
{
	name:"Finger Paint",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["flamenco"]=
{
	name:"Flamenco",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["flavors"]=
{
	name:"Flavors",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["fontdiner swanky"]=
{
	name:"Fontdiner Swanky",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["francois one"]=
{
	name:"Francois One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["fredericka the great"]=
{
	name:"Fredericka the Great",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["frijole"]=
{
	name:"Frijole",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["galindo"]=
{
	name:"Galindo",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["geo"]=
{
	name:"Geo",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["geostar"]=
{
	name:"Geostar",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["germania one"]=
{
	name:"Germania One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["graduate"]=
{
	name:"Graduate",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["griffy"]=
{
	name:"Griffy",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["gugi"]=
{
	name:"Gugi",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["hanalei"]=
{
	name:"Hanalei",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["hanalei fill"]=
{
	name:"Hanalei Fill",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["henny penny"]=
{
	name:"Henny Penny",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["homemade apple"]=
{
	name:"Homemade Apple",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["ibm plex mono"]=
{
	name:"IBM Plex Mono",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["irish grover"]=
{
	name:"Irish Grover",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["jolly lodger"]=
{
	name:"Jolly Lodger",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["kirang haerang"]=
{
	name:"Kirang Haerang",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["kranky"]=
{
	name:"Kranky",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["lacquer"]=
{
	name:"Lacquer",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["lakki reddy"]=
{
	name:"Lakki Reddy",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["lato"]=
{
	name:"Lato",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["league script"]=
{
	name:"League Script",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["love ya like a sister"]=
{
	name:"Love Ya Like A Sister",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["luckiest guy"]=
{
	name:"Luckiest Guy",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["margarine"]=
{
	name:"Margarine",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["megrim"]=
{
	name:"Megrim",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["metal mania"]=
{
	name:"Metal Mania",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["monofett"]=
{
	name:"Monofett",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["monoton"]=
{
	name:"Monoton",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["mountains of christmas"]=
{
	name:"Mountains of Christmas",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["mystery quest"]=
{
	name:"Mystery Quest",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["new rocker"]=
{
	name:"New Rocker",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["nosifer"]=
{
	name:"Nosifer",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["nova mono"]=
{
	name:"Nova Mono",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["open sans"]=
{
	name:"Open Sans",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["overpass mono"]=
{
	name:"Overpass Mono",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["oxygen mono"]=
{
	name:"Oxygen Mono",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["pangolin"]=
{
	name:"Pangolin",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["passero one"]=
{
	name:"Passero One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["permanent marker"]=
{
	name:"Permanent Marker",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["piedra"]=
{
	name:"Piedra",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["pirata one"]=
{
	name:"Pirata One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["pixeltype"]=
{
	name:"pixeltype",sizes:[{weight:"normal",style:"normal"}]
};
GoogleFonts["plaster"]=
{
	name:"Plaster",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["poiret one"]=
{
	name:"Poiret One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["princess sofia"]=
{
	name:"Princess Sofia",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["pt mono"]=
{
	name:"PT Mono",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["racing sans one"]=
{
	name:"Racing Sans One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["rakkas"]=
{
	name:"Rakkas",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["raleway"]=
{
	name:"Raleway",sizes:[{weight:"400",style:"italic"},{weight:"400",style:"normal"}]
};
GoogleFonts["raleway dots"]=
{
	name:"Raleway Dots",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["red hat display"]=
{
	name:"Red Hat Display",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["red hat text"]=
{
	name:"Red Hat Text",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["righteous"]=
{
	name:"Righteous",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["roboto"]=
{
	name:"Roboto",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["roboto mono"]=
{
	name:"Roboto Mono",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["roboto slab"]=
{
	name:"Roboto Slab",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["rock salt"]=
{
	name:"Rock Salt",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["rye"]=
{
	name:"Rye",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["saira stencil one"]=
{
	name:"Saira Stencil One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["sancreek"]=
{
	name:"Sancreek",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["sarina"]=
{
	name:"Sarina",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["schoolbell"]=
{
	name:"Schoolbell",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["seaweed script"]=
{
	name:"Seaweed Script",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["share tech mono"]=
{
	name:"Share Tech Mono",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["shojumaru"]=
{
	name:"Shojumaru",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["sigmar one"]=
{
	name:"Sigmar One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["single day"]=
{
	name:"Single Day",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["sirin stencil"]=
{
	name:"Sirin Stencil",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["smokum"]=
{
	name:"Smokum",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["snowburst one"]=
{
	name:"Snowburst One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["sonsie one"]=
{
	name:"Sonsie One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["source code pro"]=
{
	name:"Source Code Pro",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["space mono"]=
{
	name:"Space Mono",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["special elite"]=
{
	name:"Special Elite",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["spicy rice"]=
{
	name:"Spicy Rice",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["stalinist one"]=
{
	name:"Stalinist One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["stardos stencil"]=
{
	name:"Stardos Stencil",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["supermercado one"]=
{
	name:"Supermercado One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["swanky and moo moo"]=
{
	name:"Swanky and Moo Moo",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["syncopate"]=
{
	name:"Syncopate",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["text me one"]=
{
	name:"Text Me One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["trade winds"]=
{
	name:"Trade Winds",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["trocchi"]=
{
	name:"Trocchi",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["ubuntu"]=
{
	name:"Ubuntu",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["ubuntu mono"]=
{
	name:"Ubuntu Mono",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["ultra"]=
{
	name:"Ultra",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["uncial antiqua"]=
{
	name:"Uncial Antiqua",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["underdog"]=
{
	name:"Underdog",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["unifrakturcook"]=
{
	name:"UnifrakturCook",sizes:[{weight:"700",style:"normal"}]
};
GoogleFonts["unifrakturmaguntia"]=
{
	name:"UnifrakturMaguntia",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["vast shadow"]=
{
	name:"Vast Shadow",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["vt323"]=
{
	name:"VT323",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["wallpoet"]=
{
	name:"Wallpoet",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["warnes"]=
{
	name:"Warnes",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["wire one"]=
{
	name:"Wire One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["work sans"]=
{
	name:"Work Sans",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["yatra one"]=
{
	name:"Yatra One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["yeon sung"]=
{
	name:"Yeon Sung",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["yeseva one"]=
{
	name:"Yeseva One",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["zcool kuaile"]=
{
	name:"ZCOOL KuaiLe",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["zeyada"]=
{
	name:"Zeyada",sizes:[{weight:"400",style:"normal"}]
};
GoogleFonts["zilla slab"]=
{
	name:"Zilla Slab",sizes:[{weight:"400",style:"normal"},{weight:"400",style:"italic"}]
};
GoogleFonts["zilla slab highlight"]=
{
	name:"Zilla Slab Highlight",sizes:[{weight:"400",style:"normal"}]
};


